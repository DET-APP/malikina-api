/**
 * Scraper Xassidas → PostgreSQL
 * Récupère les xassidas 111→165 depuis l'API xassida.sn
 * et les importe dans PostgreSQL, avec traductions FR/EN
 */

import { query } from '../db/config.js';

const START_ID = 111;
const END_ID = 165;
const DELAY_MS = 300;
const API_TIMEOUT_MS = 15000;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

const SUPABASE_URL = 'https://api.xassida.sn';
const SUPABASE_ANON_KEY =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.' +
  'eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTcyNjUzMjUyMCwiZXhwIjo0ODgyMjA2MTIwLCJyb2xlIjoiYW5vbiJ9.' +
  'IbM1B5YYZOXq47F8lPxuNvKtQiMMaYCKQBJTonYq8aQ';

const HEADERS = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Accept': 'application/json',
};

interface RemoteAuthor {
  id: number;
  name: string;
  tariha: string;
  picture: string;
}

interface RemoteXassida {
  id: number;
  name: string;
  slug: string;
  author_id: number;
  author: RemoteAuthor;
}

interface RemoteChapter {
  id: number;
  number: number;
  name: string;
  xassida_id: number;
}

interface RemoteTranslation {
  lang: string;
  text: string;
}

interface RemoteVerse {
  id: number;
  number: number;
  key: string;
  text: string;
  transcription: string;
  chapter_id: number;
  verse_translation: RemoteTranslation[];
}

function slugToTitle(slug: string): string {
  return slug
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function supabaseGet<T>(path: string): Promise<T[]> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const url = `${SUPABASE_URL}/rest/v1/${path}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

      const res = await fetch(url, {
        headers: HEADERS,
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Supabase ${res.status}: ${path}`);
      }

      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      lastError = error as Error;
      console.error(`   ⚠️  Attempt ${attempt}/${MAX_RETRIES} failed: ${lastError.message}`);

      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS * attempt);
      }
    }
  }

  throw new Error(`Failed to fetch ${path} after ${MAX_RETRIES} attempts: ${lastError?.message}`);
}

async function upsertAuthor(remote: RemoteAuthor): Promise<number> {
  const name = slugToTitle(remote.name);
  const tradition = remote.tariha.charAt(0).toUpperCase() + remote.tariha.slice(1);
  const photoUrl = remote.picture
    ? `${SUPABASE_URL}/storage/v1/object/public/images/${remote.picture}`
    : null;

  const existing = await query('SELECT id FROM authors WHERE name = $1', [name]);
  if (existing.rows.length > 0) return existing.rows[0].id;

  const result = await query(
    'INSERT INTO authors (name, full_name, tradition, photo_url) VALUES ($1, $2, $3, $4) RETURNING id',
    [name, name, tradition, photoUrl]
  );
  return result.rows[0].id;
}

async function upsertXassida(
  remote: RemoteXassida,
  authorId: number,
  verseCount: number
): Promise<{ id: number; inserted: boolean }> {
  const title = slugToTitle(remote.name);

  const existing = await query('SELECT id FROM xassidas WHERE title = $1', [title]);
  if (existing.rows.length > 0) return { id: existing.rows[0].id, inserted: false };

  const result = await query(
    'INSERT INTO xassidas (title, author_id, verse_count) VALUES ($1, $2, $3) RETURNING id',
    [title, authorId, verseCount]
  );
  return { id: result.rows[0].id, inserted: true };
}

async function upsertVerses(
  xassidaId: number,
  chapterNumber: number,
  verses: RemoteVerse[]
): Promise<{ inserted: number; translated: number }> {
  let inserted = 0;
  let translated = 0;

  for (const verse of verses) {
    const verseKey = `${chapterNumber}:${verse.number}`;
    const frTr = verse.verse_translation?.find(t => t.lang === 'fr')?.text || null;
    const enTr = verse.verse_translation?.find(t => t.lang === 'en')?.text || null;

    const existing = await query(
      'SELECT id, translation_fr, translation_en FROM verses WHERE xassida_id = $1 AND verse_key = $2',
      [xassidaId, verseKey]
    );

    if (existing.rows.length > 0) {
      // Update translations if missing
      if ((frTr && !existing.rows[0].translation_fr) || (enTr && !existing.rows[0].translation_en)) {
        await query(
          `UPDATE verses
           SET translation_fr = COALESCE(translation_fr, $1),
               translation_en = COALESCE(translation_en, $2),
               updated_at = NOW()
           WHERE id = $3`,
          [frTr, enTr, existing.rows[0].id]
        );
        translated++;
      }
      continue;
    }

    await query(
      `INSERT INTO verses
        (xassida_id, verse_number, chapter_number, verse_key, text_arabic, transcription, content,
         translation_fr, translation_en, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())`,
      [
        xassidaId,
        verse.number,
        chapterNumber,
        verseKey,
        verse.text,
        verse.transcription || null,
        verse.text,
        frTr,
        enTr,
      ]
    );
    inserted++;
    if (frTr || enTr) translated++;
  }

  return { inserted, translated };
}

async function main() {
  try {
    await query('SELECT 1');

    const xassidas = await supabaseGet<RemoteXassida>(
      `xassida?id=gte.${START_ID}&id=lte.${END_ID}&select=id,name,slug,author_id,author(id,name,tariha,picture)&order=id`
    );

    let insertedX = 0, skippedX = 0, failedX = 0, totalVerses = 0, totalTranslated = 0;
    const errors: { name: string; error: string }[] = [];

    for (const xassida of xassidas) {
      const title = slugToTitle(xassida.name);

      try {
        if (!xassida.author) { failedX++; continue; }

        const authorId = await upsertAuthor(xassida.author);

        let chapters: RemoteChapter[] = [];
        try {
          chapters = await supabaseGet<RemoteChapter>(
            `chapter?xassida_id=eq.${xassida.id}&select=id,number,name&order=number`
          );
        } catch (err) { /* continue without chapters */ }

        const { id: xassidaId, inserted } = await upsertXassida(
          xassida,
          authorId,
          Math.max(chapters.length, 1)
        );

        let versesThisX = 0;
        let translatedThisX = 0;

        for (const chapter of chapters) {
          try {
            const verses = await supabaseGet<RemoteVerse>(
              `verse?chapter_id=eq.${chapter.id}&select=id,number,key,text,transcription,verse_translation(lang,text)&order=number`
            );
            const result = await upsertVerses(xassidaId, chapter.number, verses);
            versesThisX += result.inserted;
            translatedThisX += result.translated;
          } catch (err) { /* skip failed chapters */ }
          await sleep(50);
        }

        console.log(`[${xassida.id}] ${title} — ${versesThisX} verses, ${translatedThisX} translated`);
        if (inserted) insertedX++; else skippedX++;
        totalVerses += versesThisX;
        totalTranslated += translatedThisX;
      } catch (err) {
        errors.push({ name: title, error: (err as Error).message });
        failedX++;
      }

      await sleep(DELAY_MS);
    }

    console.log('');
    console.log(`✅ ${insertedX} imported | ⏭️  ${skippedX} existing | ❌ ${failedX} failed`);
    console.log(`📜 ${totalVerses} verses inserted | 🌐 ${totalTranslated} translations added`);

    process.exit(errors.length > 0 && failedX > 5 ? 1 : 0);
  } catch (error) {
    console.error('❌ Fatal Error:', error);
    process.exit(1);
  }
}

main();
