import { Router, Request, Response } from 'express';
import { pool } from '../db/config.js';
import { searchKnowledgeHybrid, buildContext } from '../services/rag.js';
import { chatWithGroq, ChatMessage } from '../services/groq.js';
import { generateXassidaPdf, PdfLanguage } from '../services/pdfGenerator.js';

const router = Router();

// ── Intent detection ──────────────────────────────────────────────────────────

const XASSIDA_INTENT_PATTERNS = [
  /montr[e|ez|ons]?[-\s]?moi/i,
  /affich[e|ez|ons]?/i,
  /voir\s+les?\s+xassida/i,
  /xassida[s]?\s+(de|du|par|d')/i,
  /liste\s+des?\s+xassida/i,
  /les?\s+xassida[s]?\s+de/i,
  /oeuvre[s]?\s+(de|du|par)/i,
  /poème[s]?\s+(de|du|par)/i,
  /cherche[r]?\s+.*xassida/i,
  /show me/i,
  /display/i,
];

const PDF_INTENT_PATTERNS = [
  /génèr[e|ez]?\s+(un|le|ce)\s+pdf/i,
  /générer\s+pdf/i,
  /télécharger\s+en\s+pdf/i,
  /pdf\s+(de|du|en)/i,
  /export.*pdf/i,
  /imprimer/i,
];

function detectIntent(message: string): 'xassida_search' | 'pdf_generation' | 'knowledge_qa' {
  if (PDF_INTENT_PATTERNS.some(p => p.test(message))) return 'pdf_generation';
  if (XASSIDA_INTENT_PATTERNS.some(p => p.test(message))) return 'xassida_search';
  return 'knowledge_qa';
}

function extractSearchTerms(message: string): { author?: string; title?: string; query: string } {
  // Extraire l'auteur (ex: "de Seydi Malick Sy", "de Cheikh Ibrahim Niasse")
  const authorMatch = message.match(
    /(?:de|par|du)\s+((?:seydi|cheikh?|el hadji|al hadj|sheikh|tierno|serigne|El Hadji)\s+[\w\s'-]{2,40})/i
  );
  const author = authorMatch?.[1]?.trim();

  // Extraire le titre (ex: "le xassida Mawlid", "Isawa")
  const titleMatch = message.match(
    /xassida[s]?\s+(?:de|du|sur|intitulé[e]?)?\s*["«]?([\w\s'-]{3,40})["»]?(?:\s|$)/i
  );
  const title = titleMatch?.[1]?.trim();

  return { author, title, query: message };
}

// ── Routes ────────────────────────────────────────────────────────────────────

// POST /api/chat
router.post('/', async (req: Request, res: Response) => {
  const { message, history = [] } = req.body as {
    message: string;
    history?: ChatMessage[];
  };

  if (!message?.trim()) {
    return res.status(400).json({ error: 'Message requis' });
  }

  const intent = detectIntent(message);

  // ── Intent: recherche de xassidas ──────────────────────────────
  if (intent === 'xassida_search') {
    const { author, title } = extractSearchTerms(message);

    let query = 'SELECT x.id, x.title, x.description, a.name as author_name, x.is_visible FROM xassidas x LEFT JOIN authors a ON x.author_id = a.id WHERE x.is_visible = true';
    const params: any[] = [];
    let idx = 1;

    if (author) {
      query += ` AND a.name ILIKE $${idx++}`;
      params.push(`%${author}%`);
    }
    if (title) {
      query += ` AND x.title ILIKE $${idx++}`;
      params.push(`%${title}%`);
    }
    if (!author && !title) {
      // Recherche générale par mots-clés dans le message
      const keywords = message.replace(/montre[z]?[-\s]moi|affiche[z]?|xassida[s]?|les?|des?|voir/gi, '').trim();
      if (keywords.length > 2) {
        query += ` AND (x.title ILIKE $${idx} OR a.name ILIKE $${idx})`;
        params.push(`%${keywords}%`);
        idx++;
      }
    }

    query += ' ORDER BY x.title LIMIT 20';

    const result = await pool.query(query, params);

    return res.json({
      type: 'xassida_list',
      xassidas: result.rows,
      message: result.rows.length > 0
        ? `J'ai trouvé ${result.rows.length} xassida(s)${author ? ` de ${author}` : ''}.`
        : `Je n'ai pas trouvé de xassida${author ? ` de ${author}` : ''}. Essaie avec un autre nom.`,
    });
  }

  // ── Intent: génération PDF ─────────────────────────────────────
  if (intent === 'pdf_generation') {
    return res.json({
      type: 'pdf_request',
      message: 'Pour générer un PDF, clique sur le bouton "PDF" à côté d\'un xassida, puis choisis la langue (français, arabe ou wolof).',
    });
  }

  // ── Intent: question sur les connaissances tidianes (RAG) ──────
  try {
    const chunks = await searchKnowledgeHybrid(message, 5);
    const context = buildContext(chunks);
    const answer = await chatWithGroq(message, context, history);

    const references = chunks.length > 0
      ? chunks.map(c => ({ source: c.source, title: c.title, similarity: Math.round(c.similarity * 100) }))
      : [];

    return res.json({
      type: 'knowledge_answer',
      message: answer,
      references,
    });
  } catch (err: any) {
    console.error('[CHAT] Erreur RAG/Groq:', err.message);
    return res.status(500).json({ error: 'Erreur lors du traitement de la question.' });
  }
});

// POST /api/chat/pdf/:xassidaId
router.post('/pdf/:xassidaId', async (req: Request, res: Response) => {
  const { xassidaId } = req.params;
  const language: PdfLanguage = ['fr', 'ar', 'wo'].includes(req.body.language)
    ? req.body.language
    : 'fr';

  try {
    // Charger le xassida + ses versets
    const xassidaResult = await pool.query(
      `SELECT x.id, x.title, x.description, a.name as author_name
       FROM xassidas x
       LEFT JOIN authors a ON x.author_id = a.id
       WHERE x.id = $1 AND x.is_visible = true`,
      [xassidaId]
    );

    if (!xassidaResult.rows[0]) {
      return res.status(404).json({ error: 'Xassida non trouvé' });
    }

    const xassida = xassidaResult.rows[0];

    const versesResult = await pool.query(
      `SELECT verse_number, text_ar, text_fr, text_wo, transliteration
       FROM verses
       WHERE xassida_id = $1
       ORDER BY verse_number ASC`,
      [xassidaId]
    );

    const pdfBuffer = await generateXassidaPdf(
      { ...xassida, verses: versesResult.rows },
      language
    );

    const langLabels: Record<PdfLanguage, string> = { fr: 'fr', ar: 'ar', wo: 'wo' };
    const filename = `${xassida.title.replace(/\s+/g, '_')}_${langLabels[language]}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdfBuffer);
  } catch (err: any) {
    console.error('[PDF] Erreur:', err.message);
    res.status(500).json({ error: 'Erreur lors de la génération du PDF' });
  }
});

// GET /api/chat/xassidas/search?q=...&author=...
router.get('/xassidas/search', async (req: Request, res: Response) => {
  const { q, author } = req.query as { q?: string; author?: string };

  let query = `SELECT x.id, x.title, x.description, a.name as author_name
               FROM xassidas x
               LEFT JOIN authors a ON x.author_id = a.id
               WHERE x.is_visible = true`;
  const params: any[] = [];
  let idx = 1;

  if (author) {
    query += ` AND a.name ILIKE $${idx++}`;
    params.push(`%${author}%`);
  }
  if (q) {
    query += ` AND (x.title ILIKE $${idx} OR x.description ILIKE $${idx})`;
    params.push(`%${q}%`);
    idx++;
  }

  query += ' ORDER BY x.title LIMIT 30';

  const result = await pool.query(query, params);
  res.json(result.rows);
});

export { router as chatRoutes };
