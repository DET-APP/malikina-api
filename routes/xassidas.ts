import { Router, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import multer from 'multer';
import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { pool } from '../db/config.js';
import { extractFromPdf } from '../lib/pdf-extractor.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { uploadToSpaces, deleteFromSpaces, keyFromUrl } from '../lib/spaces.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 200 * 1024 * 1024 } }); // 200 MB max

// Audio upload directory (fallback local si Spaces non configuré)
const audioDir = path.join(__dirname, '../public/audios');
const SPACES_ENABLED = !!(process.env.SPACES_ACCESS_KEY && process.env.SPACES_SECRET_KEY);

// Ensure audio directory exists
async function ensureAudioDir() {
  try {
    await fs.mkdir(audioDir, { recursive: true });
  } catch (error) {
    console.error('Error creating audio directory:', error);
  }
}

// GET all xassidas — public filtre is_visible, admin voit tout, ?fiqh=true pour livres Fiqh
router.get('/', async (req: Request, res: Response) => {
  try {
    const showAll = req.query.admin === 'true';
    const fiqhOnly = req.query.fiqh === 'true';

    const conditions: string[] = [];
    if (!showAll) conditions.push('x.is_visible = true');
    // By default, exclude fiqh books from the xassidas list unless ?fiqh=true
    if (!showAll && !fiqhOnly) conditions.push('(x.is_fiqh IS NULL OR x.is_fiqh = false)');
    if (fiqhOnly) conditions.push('x.is_fiqh = true');
    const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    const result = await pool.query(`
      SELECT
        x.id::text,
        x.title,
        x.description,
        COALESCE(x.arabic_name, '') as arabic_name,
        COALESCE(x.audio_url, '') as audio_url,
        COALESCE(x.youtube_id, '') as youtube_id,
        COALESCE(x.categorie, 'Autre') as categorie,
        COALESCE(x.verse_count, 0) as verse_count,
        COALESCE(x.is_visible, true) as is_visible,
        COALESCE(x.is_fiqh, false) as is_fiqh,
        COALESCE(x.chapters_json, '{}') as chapters_json,
        (SELECT COUNT(*) FROM verses WHERE xassida_id = x.id) as actual_verse_count,
        x.created_at,
        a.id::text as author_id,
        a.name as author_name
      FROM xassidas x
      LEFT JOIN authors a ON x.author_id = a.id
      ${whereClause}
      ORDER BY x.created_at DESC
    `);
    res.json(result.rows);
  } catch (error: any) {
    console.error('Error fetching xassidas:', error);
    res.status(500).json({ error: error.message });
  }
});

// ADMIN: Import/Update translations for verses (MUST BE BEFORE /:id)
router.post('/admin/import-translations', requireAuth, requireRole('SuperAdmin', 'Admin', 'GerantXassida'), async (req: Request, res: Response) => {
  try {
    // Support both formats:
    // 1. { translations: [...], xassida_id: "..." }
    // 2. Direct array [...] (with xassida_id as param)
    let translations = req.body.translations || req.body;
    const xassida_id = req.body.xassida_id;

    if (!Array.isArray(translations)) {
      return res.status(400).json({ error: 'translations must be an array' });
    }

    let updated = 0;
    const errors: string[] = [];

    for (const trans of translations) {
      try {
        const { verse_id, verse_number, translation_fr, translation_en, translation_wo, transcription } = trans;
        const transXassidaId = trans.xassida_id || xassida_id;

        let finalVerseId = verse_id;

        // If verse_id not provided but verse_number + xassida_id provided, lookup verse_id
        if (!finalVerseId && verse_number && transXassidaId) {
          const verseResult = await pool.query(`
            SELECT id FROM verses 
            WHERE xassida_id = $1 AND verse_number = $2
            LIMIT 1
          `, [transXassidaId, verse_number]);

          if (verseResult.rows.length > 0) {
            finalVerseId = verseResult.rows[0].id;
          } else {
            errors.push(`Verse ${verse_number} not found in xassida ${transXassidaId}`);
            continue;
          }
        }

        if (!finalVerseId) {
          errors.push('Missing verse_id or (verse_number + xassida_id)');
          continue;
        }

        const result = await pool.query(`
          UPDATE verses
          SET
            translation_fr = COALESCE($1, translation_fr),
            translation_en = COALESCE($2, translation_en),
            translation_wo = COALESCE($3, translation_wo),
            transcription = COALESCE($4, transcription),
            updated_at = NOW()
          WHERE id = $5
          RETURNING id
        `, [translation_fr || null, translation_en || null, translation_wo || null, transcription || null, finalVerseId]);

        if (result.rows.length > 0) {
          updated++;
        } else {
          errors.push(`Verse ${finalVerseId} not found`);
        }
      } catch (err: any) {
        errors.push(`Error updating verse: ${err.message}`);
      }
    }

    res.json({
      message: 'Import completed',
      updated,
      total: translations.length,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error: any) {
    console.error('Error importing translations:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST admin: Re-scrape all xassidas
router.post('/admin/rescrape', requireAuth, requireRole('SuperAdmin', 'Admin'), async (req: Request, res: Response) => {
  try {
    // Check if scraper is already running
    const result = await pool.query(`SELECT COUNT(*) FROM information_schema.processlist WHERE info LIKE '%scrape%'`).catch(() => ({ rows: [{ count: 0 }] }));
    
    // Spawn scraper process
    const scraper = spawn('npm', ['run', 'scrape'], {
      cwd: path.join(__dirname, '..'),
      detached: true,
      stdio: 'pipe'
    });
    
    let output = '';
    scraper.stdout?.on('data', (data) => {
      output += data.toString();
      console.log('Scraper:', output.split('\n').pop());
    });
    
    scraper.stderr?.on('data', (data) => {
      console.error('Scraper error:', data.toString());
    });
    
    // Unref so process doesn't keep parent alive
    scraper.unref();
    
    res.json({
      message: 'Scraper started in background',
      status: 'running',
      pid: scraper.pid,
      note: 'Check API logs for progress. Scraper will retry failed requests.'
    });
  } catch (error: any) {
    console.error('Error starting scraper:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET admin: Check data integrity
router.get('/admin/integrity-check', requireAuth, requireRole('SuperAdmin', 'Admin', 'Moderateur'), async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        x.id,
        x.title,
        COUNT(DISTINCT v.chapter_number) as chapters,
        COUNT(DISTINCT v.verse_number) as verses,
        COUNT(DISTINCT CASE WHEN v.text_arabic IS NOT NULL THEN 1 END) as verses_with_arabic,
        COUNT(DISTINCT CASE WHEN v.transcription IS NOT NULL THEN 1 END) as verses_with_transcription,
        COUNT(DISTINCT CASE WHEN v.translation_fr IS NOT NULL THEN 1 END) as verses_with_french,
        CASE 
          WHEN COUNT(DISTINCT v.verse_number) = 0 THEN 'MISSING'
          WHEN COUNT(DISTINCT v.verse_number) < 10 THEN 'INCOMPLETE'
          WHEN COUNT(DISTINCT CASE WHEN v.transcription IS NULL THEN 1 END) > 0 THEN 'MISSING_TRANSCRIPTION'
          WHEN COUNT(DISTINCT CASE WHEN v.text_arabic IS NULL THEN 1 END) > 0 THEN 'MISSING_ARABIC'
          ELSE 'OK'
        END as status
      FROM xassidas x 
      LEFT JOIN verses v ON x.id = v.xassida_id
      GROUP BY x.id, x.title
      ORDER BY verses ASC, x.id ASC
    `);
    
    const summary = {
      total: result.rows.length,
      ok: result.rows.filter((r: any) => r.status === 'OK').length,
      incomplete: result.rows.filter((r: any) => r.status === 'INCOMPLETE').length,
      missing: result.rows.filter((r: any) => r.status === 'MISSING').length,
      issues: result.rows.filter((r: any) => r.status !== 'OK')
    };
    
    res.json({ summary, details: result.rows });
  } catch (error: any) {
    console.error('Error checking integrity:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET admin: List categories
router.get('/admin/categories', requireAuth, requireRole('SuperAdmin', 'Admin', 'GerantXassida', 'Moderateur'), async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT categorie FROM xassidas WHERE categorie IS NOT NULL ORDER BY categorie ASC`
    );
    const categories = result.rows.map((r: any) => r.categorie);
    const defaults = ['Eloge du Prophète', 'Louange à Dieu', 'Invocation', 'Sagesse', 'Autre'];
    const merged = [...new Set([...defaults, ...categories])].sort();
    res.json({ categories: merged });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET admin: Data statistics
router.get('/admin/stats', requireAuth, requireRole('SuperAdmin', 'Admin', 'GerantXassida', 'GerantAudio', 'Moderateur'), async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        'xassidas' as type, COUNT(*) as count FROM xassidas
      UNION ALL
      SELECT 'verses' as type, COUNT(*) as count FROM verses
      UNION ALL
      SELECT 'authors' as type, COUNT(*) as count FROM authors
      UNION ALL
      SELECT 'verses_with_translations' as type, COUNT(*) as count FROM verses WHERE translation_fr IS NOT NULL
    `);
    
    const stats = Object.fromEntries(result.rows.map((r: any) => [r.type, r.count]));
    res.json(stats);
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// ── Audio CRUD ───────────────────────────────────────────────────────────────

// GET all audios for a xassida
router.get('/:id/audios', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT id, xassida_id, chapter_number, reciter_name, youtube_id, audio_url, label, order_index, start_time, end_time, created_at
       FROM xassida_audios
       WHERE xassida_id = $1
       ORDER BY order_index ASC, chapter_number ASC NULLS FIRST, created_at ASC`,
      [id]
    );
    res.json(result.rows);
  } catch (error: any) {
    console.error('Error fetching xassida audios:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST add audio to a xassida
router.post('/:id/audios', requireAuth, requireRole('SuperAdmin', 'Admin', 'GerantAudio', 'GerantXassida'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reciter_name, chapter_number, youtube_url, audio_url, label, order_index, start_time, end_time } = req.body;

    if (!reciter_name || !reciter_name.trim()) {
      return res.status(400).json({ error: 'reciter_name is required' });
    }

    // Extract youtube_id from various YouTube URL formats
    let youtube_id: string | null = null;
    if (youtube_url && youtube_url.trim()) {
      try {
        const url = new URL(youtube_url.trim());
        if (url.hostname === 'youtu.be') youtube_id = url.pathname.slice(1);
        else if (url.hostname.includes('youtube.com')) youtube_id = url.searchParams.get('v');
      } catch {
        if (/^[a-zA-Z0-9_-]{11}$/.test(youtube_url.trim())) youtube_id = youtube_url.trim();
      }
    }

    const finalAudioUrl = audio_url?.trim() || null;

    if (!youtube_id && !finalAudioUrl) {
      return res.status(400).json({ error: 'Either youtube_url or audio_url is required' });
    }

    // Verify xassida exists
    const xassidaCheck = await pool.query('SELECT id FROM xassidas WHERE id = $1', [id]);
    if (xassidaCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Xassida not found' });
    }

    const result = await pool.query(
      `INSERT INTO xassida_audios (xassida_id, chapter_number, reciter_name, youtube_id, audio_url, label, order_index, start_time, end_time)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, xassida_id, chapter_number, reciter_name, youtube_id, audio_url, label, order_index, start_time, end_time, created_at`,
      [
        id,
        chapter_number != null && chapter_number !== '' ? Number(chapter_number) : null,
        reciter_name.trim(),
        youtube_id,
        finalAudioUrl,
        label?.trim() || null,
        order_index ?? 0,
        start_time ?? null,
        end_time ?? null
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error('Error adding xassida audio:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST download YouTube audio → DigitalOcean Spaces
router.post('/:id/audios/:audioId/download-to-spaces', requireAuth, requireRole('SuperAdmin', 'Admin', 'GerantAudio', 'GerantXassida'), async (req: Request, res: Response) => {
  const { id, audioId } = req.params;
  try {
    // Get the audio record
    const audioResult = await pool.query(
      'SELECT id, xassida_id, youtube_id, audio_url FROM xassida_audios WHERE id = $1 AND xassida_id = $2',
      [audioId, id]
    );
    if (audioResult.rows.length === 0) return res.status(404).json({ error: 'Audio introuvable' });

    const audio = audioResult.rows[0];
    if (!audio.youtube_id) return res.status(400).json({ error: 'Cet audio n\'a pas de YouTube ID' });

    const youtubeUrl = `https://www.youtube.com/watch?v=${audio.youtube_id}`;

    // Stream yt-dlp output directly into memory (no temp file)
    const audioBuffer: Buffer = await new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      const ytdlp = spawn('yt-dlp', [
        '-x',
        '--audio-format', 'mp3',
        '--audio-quality', '5',
        '--no-playlist',
        '-o', '-',          // output to stdout
        youtubeUrl,
      ]);
      ytdlp.stdout.on('data', (chunk: Buffer) => chunks.push(chunk));
      ytdlp.stderr.on('data', (d: Buffer) => console.log('[yt-dlp]', d.toString()));
      ytdlp.on('close', (code) => {
        if (code !== 0) return reject(new Error(`yt-dlp exited with code ${code}`));
        resolve(Buffer.concat(chunks));
      });
      ytdlp.on('error', reject);
    });

    // Upload to Spaces
    const key = `audios/xassida-${id}-audio-${audioId}-${Date.now()}.mp3`;
    const spacesUrl = await uploadToSpaces(audioBuffer, key, 'audio/mpeg');

    // Delete old Spaces file if replacing
    if (audio.audio_url) {
      const oldKey = keyFromUrl(audio.audio_url);
      if (oldKey) await deleteFromSpaces(oldKey).catch(() => {});
    }

    // Update DB
    await pool.query(
      'UPDATE xassida_audios SET audio_url = $1, youtube_id = youtube_id WHERE id = $2',
      [spacesUrl, audioId]
    );

    res.json({ audio_url: spacesUrl, message: 'Audio stocké sur Spaces' });
  } catch (error: any) {
    console.error('Error downloading audio to Spaces:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT update audio
router.put('/:id/audios/:audioId', requireAuth, requireRole('SuperAdmin', 'Admin', 'GerantAudio', 'GerantXassida'), async (req: Request, res: Response) => {
  try {
    const { audioId } = req.params;
    const { reciter_name, chapter_number, youtube_url, audio_url, label, order_index, start_time, end_time } = req.body;

    let youtube_id: string | null = null;
    if (youtube_url && youtube_url.trim()) {
      try {
        const url = new URL(youtube_url.trim());
        if (url.hostname === 'youtu.be') youtube_id = url.pathname.slice(1);
        else if (url.hostname.includes('youtube.com')) youtube_id = url.searchParams.get('v');
      } catch {
        if (/^[a-zA-Z0-9_-]{11}$/.test(youtube_url.trim())) youtube_id = youtube_url.trim();
      }
    }

    const result = await pool.query(
      `UPDATE xassida_audios SET
         reciter_name   = COALESCE($1, reciter_name),
         chapter_number = $2,
         youtube_id     = CASE WHEN $3::text IS NOT NULL THEN $3 ELSE youtube_id END,
         audio_url      = CASE WHEN $4::text IS NOT NULL THEN $4 ELSE audio_url END,
         label          = $5,
         order_index    = COALESCE($6, order_index),
         start_time     = CASE WHEN $8 IS NOT NULL THEN $8 ELSE start_time END,
         end_time       = CASE WHEN $9 IS NOT NULL THEN $9 ELSE end_time END
       WHERE id = $7
       RETURNING *`,
      [
        reciter_name?.trim() || null,
        (chapter_number != null && chapter_number !== '') ? Number(chapter_number) : null,
        youtube_id,
        audio_url?.trim() || null,
        label?.trim() || null,
        order_index ?? null,
        audioId,
        start_time ?? null,
        end_time ?? null
      ]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Audio not found' });
    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error updating audio:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE audio
router.delete('/:id/audios/:audioId', requireAuth, requireRole('SuperAdmin', 'Admin', 'GerantAudio'), async (req: Request, res: Response) => {
  try {
    const { audioId } = req.params;
    const result = await pool.query(
      'DELETE FROM xassida_audios WHERE id = $1 RETURNING id',
      [audioId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Audio not found' });
    }
    res.json({ message: 'Audio deleted', id: audioId });
  } catch (error: any) {
    console.error('Error deleting audio:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET single xassida with verses
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Get xassida
    const xassidaResult = await pool.query(`
      SELECT 
        x.id::text,
        x.title,
        x.description,
        COALESCE(x.arabic_name, '') as arabic_name,
        COALESCE(x.audio_url, '') as audio_url,
        COALESCE(x.youtube_id, '') as youtube_id,
        COALESCE(x.categorie, 'Autre') as categorie,
        COALESCE(x.verse_count, 0) as verse_count,
        COALESCE(x.chapters_json, '{}') as chapters_json,
        x.created_at,
        a.id::text as author_id,
        a.name as author_name,
        a.photo_url
      FROM xassidas x
      LEFT JOIN authors a ON x.author_id = a.id
      WHERE x.id = $1
    `, [id]);

    if (xassidaResult.rows.length === 0) {
      return res.status(404).json({ error: 'Xassida not found' });
    }

    // Get verses
    const versesResult = await pool.query(`
      SELECT 
        id,
        xassida_id,
        chapter_number,
        verse_number,
        verse_key,
        text_arabic,
        transcription,
        translation_fr,
        translation_en,
        translation_wo,
        words,
        audio_url,
        created_at,
        updated_at
      FROM verses
      WHERE xassida_id = $1
      ORDER BY chapter_number ASC, verse_number ASC
    `, [id]);

    // Get audios (multiple reciters / per-chapter)
    const audiosResult = await pool.query(
      `SELECT id, xassida_id, chapter_number, reciter_name, youtube_id, audio_url, label, order_index, start_time, end_time
       FROM xassida_audios
       WHERE xassida_id = $1
       ORDER BY order_index ASC, chapter_number ASC NULLS FIRST, created_at ASC`,
      [id]
    );

    const xassida = xassidaResult.rows[0];
    res.json({
      ...xassida,
      verses: versesResult.rows,
      verse_count: versesResult.rows.length,
      audios: audiosResult.rows
    });
  } catch (error: any) {
    console.error('Error fetching xassida:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET verses of xassida (with all fields in correct format)
router.get('/:id/verses', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        xassida_id,
        chapter_number,
        verse_number,
        verse_key,
        text_arabic,
        transcription,
        translation_fr,
        translation_en,
        translation_wo,
        words,
        audio_url,
        notes,
        created_at,
        updated_at
      FROM verses
      WHERE xassida_id = $1
      ORDER BY chapter_number ASC, verse_number ASC
    `, [req.params.id]);
    res.json(result.rows);
  } catch (error: any) {
    console.error('Error fetching verses:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT update a single verse
router.put('/:id/verses/:verseId', requireAuth, requireRole('SuperAdmin', 'Admin', 'GerantXassida'), async (req: Request, res: Response) => {
  try {
    const { verseId } = req.params;
    const { text_arabic, transcription, translation_fr, translation_en, translation_wo, audio_url, verse_number, chapter_number } = req.body;

    const result = await pool.query(`
      UPDATE verses SET
        text_arabic    = COALESCE($1, text_arabic),
        transcription  = COALESCE($2, transcription),
        translation_fr = COALESCE($3, translation_fr),
        translation_en = COALESCE($4, translation_en),
        translation_wo = COALESCE($5, translation_wo),
        audio_url      = COALESCE($6, audio_url),
        verse_number   = COALESCE($7, verse_number),
        chapter_number = COALESCE($8, chapter_number),
        content        = COALESCE($1, text_arabic),
        updated_at     = NOW()
      WHERE id = $9
      RETURNING id, xassida_id, chapter_number, verse_number, text_arabic, transcription, translation_fr, translation_en, translation_wo, audio_url, updated_at
    `, [
      text_arabic || null,
      transcription || null,
      translation_fr || null,
      translation_en || null,
      translation_wo || null,
      audio_url || null,
      verse_number ?? null,
      chapter_number ?? null,
      verseId,
    ]);

    if (result.rows.length === 0) return res.status(404).json({ error: 'Verse not found' });
    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error updating verse:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE a single verse
router.delete('/:id/verses/:verseId', requireAuth, requireRole('SuperAdmin', 'Admin', 'GerantXassida'), async (req: Request, res: Response) => {
  try {
    const { id, verseId } = req.params;
    const result = await pool.query(
      'DELETE FROM verses WHERE id = $1 AND xassida_id = $2 RETURNING id',
      [verseId, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Verse not found' });

    // Update verse_count
    const countResult = await pool.query('SELECT COUNT(*) as count FROM verses WHERE xassida_id = $1', [id]);
    await pool.query('UPDATE xassidas SET verse_count = $1 WHERE id = $2', [countResult.rows[0].count, id]);

    res.json({ message: 'Verse deleted', id: verseId });
  } catch (error: any) {
    console.error('Error deleting verse:', error);
    res.status(500).json({ error: error.message });
  }
});

// CREATE xassida
router.post('/', requireAuth, requireRole('SuperAdmin', 'Admin', 'GerantXassida'), async (req: Request, res: Response) => {
  try {
    const { title, author_id, description, audio_url, arabic_name, categorie, is_fiqh } = req.body;

    if (!title || !author_id) {
      return res.status(400).json({ error: 'title and author_id are required' });
    }

    const result = await pool.query(`
      INSERT INTO xassidas (title, author_id, description, audio_url, arabic_name, categorie, is_fiqh, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING id, title, description, audio_url, arabic_name, categorie, is_fiqh, created_at, author_id
    `, [title, author_id, description || null, audio_url || null, arabic_name || null, categorie || 'Autre', is_fiqh || false]);

    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error('Error creating xassida:', error);
    res.status(500).json({ error: error.message });
  }
});

// UPDATE xassida
router.put('/:id', requireAuth, requireRole('SuperAdmin', 'Admin', 'GerantXassida'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, author_id, audio_url, arabic_name, categorie, is_fiqh, chapters_json } = req.body;

    const chaptersJsonStr = chapters_json != null ? JSON.stringify(chapters_json) : null;

    const result = await pool.query(`
      UPDATE xassidas
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          author_id = COALESCE($3, author_id),
          audio_url = COALESCE($4, audio_url),
          arabic_name = COALESCE($5, arabic_name),
          categorie = COALESCE($6, categorie),
          is_fiqh = CASE WHEN $8::text IS NOT NULL THEN ($8::text)::boolean ELSE is_fiqh END,
          chapters_json = CASE WHEN $9::text IS NOT NULL THEN ($9::text)::jsonb ELSE chapters_json END
      WHERE id = $7
      RETURNING id, title, description, audio_url, arabic_name, categorie, is_fiqh, chapters_json, youtube_id, created_at, author_id
    `, [title || null, description || null, author_id || null, audio_url || null, arabic_name || null, categorie || null, id, is_fiqh != null ? String(is_fiqh) : null, chaptersJsonStr]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Xassida not found' });
    }

    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error updating xassida:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE xassida
router.delete('/:id', requireAuth, requireRole('SuperAdmin', 'Admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Delete verses first
    await pool.query('DELETE FROM verses WHERE xassida_id = $1', [id]);

    // Delete xassida
    const result = await pool.query('DELETE FROM xassidas WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Xassida not found' });
    }

    res.json({ message: 'Xassida deleted', id });
  } catch (error: any) {
    console.error('Error deleting xassida:', error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH visibility toggle
router.patch('/:id/visibility', requireAuth, requireRole('SuperAdmin', 'Admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { is_visible } = req.body;
    if (typeof is_visible !== 'boolean') {
      return res.status(400).json({ error: 'is_visible (boolean) requis' });
    }
    const result = await pool.query(
      'UPDATE xassidas SET is_visible = $1 WHERE id = $2 RETURNING id, title, is_visible',
      [is_visible, id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Xassida non trouvée' });
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// SET youtube ID from URL
router.post('/:id/set-youtube-id', requireAuth, requireRole('SuperAdmin', 'Admin', 'GerantXassida', 'GerantAudio'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { youtube_url } = req.body;

    if (!youtube_url) {
      return res.status(400).json({ error: 'youtube_url is required' });
    }

    // Extract YouTube ID from various URL formats
    let youtubeId: string | null = null;
    try {
      const url = new URL(youtube_url);
      if (url.hostname === 'youtu.be') {
        youtubeId = url.pathname.slice(1);
      } else if (url.hostname.includes('youtube.com')) {
        youtubeId = url.searchParams.get('v');
      }
    } catch {
      // Try as raw ID
      if (/^[a-zA-Z0-9_-]{11}$/.test(youtube_url)) {
        youtubeId = youtube_url;
      }
    }

    if (!youtubeId) {
      return res.status(400).json({ error: 'Could not extract YouTube ID from URL' });
    }

    const result = await pool.query(
      `UPDATE xassidas SET youtube_id = $1 WHERE id = $2 RETURNING id, youtube_id`,
      [youtubeId, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Xassida not found' });
    }

    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error setting YouTube ID:', error);
    res.status(500).json({ error: error.message });
  }
});

// UPLOAD audio for xassida → DigitalOcean Spaces (ou local en fallback)
router.post('/:id/upload-audio', requireAuth, requireRole('SuperAdmin', 'Admin', 'GerantAudio', 'GerantXassida'), upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });

    const allowedMimes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm', 'audio/mp4'];
    if (!allowedMimes.includes(req.file.mimetype)) {
      return res.status(400).json({ error: 'Format invalide. Autorisés : MP3, WAV, OGG, WebM, M4A' });
    }

    const ext = req.file.mimetype === 'audio/mpeg' ? 'mp3'
              : req.file.mimetype === 'audio/wav'  ? 'wav'
              : req.file.mimetype === 'audio/ogg'  ? 'ogg'
              : req.file.mimetype === 'audio/webm' ? 'webm' : 'm4a';
    const filename = `${req.params.id}-${Date.now()}.${ext}`;

    let audioUrl: string;

    if (SPACES_ENABLED) {
      const key = `audios/${filename}`;
      audioUrl = await uploadToSpaces(req.file.buffer, key, req.file.mimetype);
    } else {
      // Fallback local
      await ensureAudioDir();
      await fs.writeFile(path.join(audioDir, filename), req.file.buffer);
      audioUrl = `/audios/${filename}`;
    }

    res.json({ message: 'Audio uploadé avec succès', audioUrl, filename, storage: SPACES_ENABLED ? 'spaces' : 'local' });
  } catch (error: any) {
    console.error('Audio upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// UPLOAD PDF and extract verses
router.post('/:id/upload-pdf', requireAuth, requireRole('SuperAdmin', 'Admin', 'GerantXassida'), upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Le fichier doit être un PDF' });
    }

    console.log(`[PDF] Extraction en cours pour xassida ${req.params.id} (${req.file.originalname}, ${(req.file.size / 1024).toFixed(0)} Ko)`);

    const result = await extractFromPdf(req.file.buffer);

    console.log(`[PDF] Extraction terminée: ${result.verses.length} vers détectés, auteur: ${result.metadata.detected_author || 'inconnu'}`);

    res.json({
      message: 'PDF analysé avec succès',
      xassidaId: req.params.id,
      filename: req.file.originalname,
      verses: result.verses,
      metadata: result.metadata,
    });
  } catch (error: any) {
    console.error('Error extracting PDF:', error);
    res.status(500).json({ error: `Erreur d'extraction PDF: ${error.message}` });
  }
});

// POST verses for a xassida (create or replace)
router.post('/:id/verses', requireAuth, requireRole('SuperAdmin', 'Admin', 'GerantXassida'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { verses, replaceExisting } = req.body;

    if (!Array.isArray(verses) || verses.length === 0) {
      return res.status(400).json({ error: 'verses doit être un tableau non vide' });
    }

    // Verify xassida exists
    const xassidaCheck = await pool.query('SELECT id FROM xassidas WHERE id = $1', [id]);
    if (xassidaCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Xassida non trouvée' });
    }

    // Delete existing verses if replacing
    if (replaceExisting) {
      await pool.query('DELETE FROM verses WHERE xassida_id = $1', [id]);
    }

    let inserted = 0;
    const errors: string[] = [];

    for (const verse of verses) {
      try {
        const chapterNum = verse.chapter_number ?? 1;
        const verseNum = verse.verse_number;
        const verseKey = `${chapterNum}:${verseNum}`;

        await pool.query(`
          INSERT INTO verses (xassida_id, verse_number, chapter_number, verse_key, text_arabic, transcription, translation_fr, translation_en, translation_wo, content, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
        `, [
          id,
          verseNum,
          chapterNum,
          verseKey,
          verse.text_arabic || '',
          verse.transcription || null,
          verse.translation_fr || null,
          verse.translation_en || null,
          verse.translation_wo || null,
          verse.text_arabic || '',
        ]);
        inserted++;
      } catch (err: any) {
        errors.push(`Vers ${verse.verse_number}: ${err.message}`);
      }
    }

    // Update verse_count on xassida
    const countResult = await pool.query('SELECT COUNT(*) as count FROM verses WHERE xassida_id = $1', [id]);
    await pool.query('UPDATE xassidas SET verse_count = $1 WHERE id = $2', [countResult.rows[0].count, id]);

    res.json({
      message: `${inserted} vers sauvegardés`,
      inserted,
      total: verses.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error('Error saving verses:', error);
    res.status(500).json({ error: error.message });
  }
});

export { router as xassidaRoutes };
