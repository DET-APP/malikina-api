-- Migration: 014_fix_verses_schema.sql
-- Purpose: Add missing columns to verses table and make content nullable

ALTER TABLE verses ALTER COLUMN content DROP NOT NULL;

ALTER TABLE verses ADD COLUMN IF NOT EXISTS chapter_number INTEGER;
ALTER TABLE verses ADD COLUMN IF NOT EXISTS verse_key VARCHAR(50);
ALTER TABLE verses ADD COLUMN IF NOT EXISTS text_arabic TEXT;
ALTER TABLE verses ADD COLUMN IF NOT EXISTS transcription TEXT;
ALTER TABLE verses ADD COLUMN IF NOT EXISTS words JSONB;

CREATE INDEX IF NOT EXISTS idx_verses_verse_key ON verses(xassida_id, verse_key);
