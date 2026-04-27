import 'dotenv/config';
import { pool } from '../db/config.js';
import { uploadToSpaces, keyFromUrl, CDN_BASE } from '../lib/spaces.js';

async function migratePhotos() {
  const result = await pool.query(
    `SELECT id, name, photo_url FROM authors WHERE photo_url LIKE '%xassida.sn%' ORDER BY id`
  );

  if (result.rows.length === 0) {
    console.log('No photos to migrate — all clean.');
    await pool.end();
    return;
  }

  console.log(`Found ${result.rows.length} authors with xassida.sn photos.\n`);

  let success = 0;
  let failed = 0;

  for (const author of result.rows) {
    const { id, name, photo_url } = author;
    try {
      console.log(`[${id}] ${name} — downloading ${photo_url}`);

      const response = await fetch(photo_url, { signal: AbortSignal.timeout(15000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const contentType = response.headers.get('content-type') || 'image/jpeg';
      const ext = contentType.includes('png') ? 'png'
        : contentType.includes('webp') ? 'webp'
        : contentType.includes('gif') ? 'gif'
        : 'jpg';

      const buffer = Buffer.from(await response.arrayBuffer());
      const key = `photos/author-${id}-${Date.now()}.${ext}`;
      const spacesUrl = await uploadToSpaces(buffer, key, contentType);

      await pool.query('UPDATE authors SET photo_url = $1 WHERE id = $2', [spacesUrl, id]);
      console.log(`  ✓ Migrated → ${spacesUrl}`);
      success++;
    } catch (err: any) {
      console.error(`  ✗ Failed: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone: ${success} migrated, ${failed} failed.`);
  await pool.end();
}

migratePhotos().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
