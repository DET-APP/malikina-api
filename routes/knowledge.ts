import { Router, Request, Response } from 'express';
import { pool } from '../db/config.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { searchAndStore } from '../services/webSearch.js';

const router = Router();

// Middleware commun : SuperAdmin ou Admin seulement
const adminOnly = [requireAuth, requireRole('SuperAdmin', 'Admin')];

/**
 * GET /api/knowledge/stats
 * Retourne les statistiques de la base de connaissances.
 * NB: placé avant /:id pour éviter le conflit de route
 */
router.get('/stats', ...adminOnly, async (_req: Request, res: Response) => {
  try {
    const totalResult = await pool.query('SELECT COUNT(*) AS total FROM knowledge_chunks');
    const sourcesResult = await pool.query(
      "SELECT COUNT(DISTINCT source) AS sources FROM knowledge_chunks"
    );
    const autoResult = await pool.query(
      `SELECT COUNT(*) AS auto_enriched FROM knowledge_chunks
       WHERE (metadata->>'auto_enriched')::boolean = true`
    );

    res.json({
      total: parseInt(totalResult.rows[0].total, 10),
      sources: parseInt(sourcesResult.rows[0].sources, 10),
      auto_enriched: parseInt(autoResult.rows[0].auto_enriched, 10),
    });
  } catch (err: any) {
    console.error('[KNOWLEDGE] stats error:', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * GET /api/knowledge?page=1&limit=20&search=xxx
 * Liste paginée des chunks avec recherche optionnelle.
 */
router.get('/', ...adminOnly, async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 20));
  const search = (req.query.search as string || '').trim();
  const offset = (page - 1) * limit;

  try {
    let countQuery: string;
    let dataQuery: string;
    const params: any[] = [];

    if (search) {
      countQuery = `SELECT COUNT(*) AS total FROM knowledge_chunks
                    WHERE content ILIKE $1 OR title ILIKE $1 OR source ILIKE $1`;
      dataQuery = `SELECT id, source, title, language, created_at,
                          LEFT(content, 200) AS content_preview,
                          metadata
                   FROM knowledge_chunks
                   WHERE content ILIKE $1 OR title ILIKE $1 OR source ILIKE $1
                   ORDER BY created_at DESC
                   LIMIT $2 OFFSET $3`;
      params.push(`%${search}%`, limit, offset);
    } else {
      countQuery = `SELECT COUNT(*) AS total FROM knowledge_chunks`;
      dataQuery = `SELECT id, source, title, language, created_at,
                          LEFT(content, 200) AS content_preview,
                          metadata
                   FROM knowledge_chunks
                   ORDER BY created_at DESC
                   LIMIT $1 OFFSET $2`;
      params.push(limit, offset);
    }

    const [countResult, dataResult] = await Promise.all([
      pool.query(countQuery, search ? [params[0]] : []),
      pool.query(dataQuery, params),
    ]);

    const total = parseInt(countResult.rows[0].total, 10);

    res.json({
      data: dataResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err: any) {
    console.error('[KNOWLEDGE] list error:', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * POST /api/knowledge
 * Créer un nouveau chunk.
 */
router.post('/', ...adminOnly, async (req: Request, res: Response) => {
  const { source, title, language, content } = req.body;

  if (!content || content.trim() === '') {
    return res.status(400).json({ error: 'Le champ content est requis' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO knowledge_chunks (source, title, content, language, metadata)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, source, title, language, created_at, metadata`,
      [
        source?.trim() || '',
        title?.trim() || '',
        content.trim(),
        language || 'fr',
        JSON.stringify({ created_by: req.admin?.email, manual: true }),
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error('[KNOWLEDGE] create error:', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * GET /api/knowledge/:id
 * Récupère un chunk complet (avec le content entier).
 */
router.get('/:id', ...adminOnly, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT id, source, title, content, language, created_at, metadata
       FROM knowledge_chunks WHERE id = $1`,
      [id]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Chunk non trouvé' });
    }
    res.json(result.rows[0]);
  } catch (err: any) {
    console.error('[KNOWLEDGE] get error:', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * PUT /api/knowledge/:id
 * Modifier un chunk existant.
 */
router.put('/:id', ...adminOnly, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { source, title, language, content } = req.body;

  if (!content || content.trim() === '') {
    return res.status(400).json({ error: 'Le champ content est requis' });
  }

  try {
    const result = await pool.query(
      `UPDATE knowledge_chunks
       SET source = $1, title = $2, content = $3, language = $4,
           metadata = metadata || $5::jsonb
       WHERE id = $6
       RETURNING id, source, title, language, created_at, metadata`,
      [
        source?.trim() || '',
        title?.trim() || '',
        content.trim(),
        language || 'fr',
        JSON.stringify({ updated_by: req.admin?.email, updated_at: new Date().toISOString() }),
        id,
      ]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Chunk non trouvé' });
    }

    res.json(result.rows[0]);
  } catch (err: any) {
    console.error('[KNOWLEDGE] update error:', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * DELETE /api/knowledge/:id
 * Supprimer un chunk.
 */
router.delete('/:id', ...adminOnly, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM knowledge_chunks WHERE id = $1 RETURNING id, title',
      [id]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Chunk non trouvé' });
    }
    res.json({ message: 'Chunk supprimé', chunk: result.rows[0] });
  } catch (err: any) {
    console.error('[KNOWLEDGE] delete error:', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * POST /api/knowledge/web-import
 * Lance une recherche web via Brave et stocke les résultats.
 */
router.post('/web-import', ...adminOnly, async (req: Request, res: Response) => {
  const { query } = req.body;

  if (!query || query.trim() === '') {
    return res.status(400).json({ error: 'Le champ query est requis' });
  }

  try {
    const inserted = await searchAndStore(query.trim(), pool);
    res.json({
      message: `${inserted} chunk(s) importé(s) depuis la recherche web`,
      inserted,
      query: query.trim(),
    });
  } catch (err: any) {
    console.error('[KNOWLEDGE] web-import error:', err.message);
    res.status(500).json({ error: 'Erreur lors de la recherche web' });
  }
});

export { router as knowledgeRoutes };
