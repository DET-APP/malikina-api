-- Migration: 009_fix_id_types_to_text.sql
-- Created: 2026-04-15
-- Purpose: Convert SERIAL/INTEGER id columns to TEXT to support UUID-based identifiers
--
-- Context: Routes generate UUIDs via uuid() for all IDs, but the original schema used
-- SERIAL (auto-increment integers). This migration aligns the DB schema with the code.
-- On the live server, authors.id was already altered to TEXT; this migration fixes
-- xassidas.author_id (still INTEGER) and the verses FK column.
--
-- Note: FK constraints are dropped but NOT re-added because existing data may have
-- integer author_ids that don't match UUID authors.id values. Application code
-- enforces referential integrity instead.

-- ─── 1. Drop foreign key constraints that reference columns we're altering ───

ALTER TABLE xassidas DROP CONSTRAINT IF EXISTS xassidas_author_id_fkey;
ALTER TABLE xassidas DROP CONSTRAINT IF EXISTS xassidas_author_id_fkey1;
ALTER TABLE verses   DROP CONSTRAINT IF EXISTS verses_xassida_id_fkey;

-- ─── 2. Convert xassidas.author_id: INTEGER → TEXT ───────────────────────────

DO $$
BEGIN
  IF (SELECT data_type FROM information_schema.columns
      WHERE table_name = 'xassidas' AND column_name = 'author_id') = 'integer' THEN
    ALTER TABLE xassidas ALTER COLUMN author_id TYPE TEXT USING author_id::TEXT;
  END IF;
END $$;

-- ─── 3. Convert xassidas.id: SERIAL → TEXT (if still integer) ────────────────

DO $$
BEGIN
  IF (SELECT data_type FROM information_schema.columns
      WHERE table_name = 'xassidas' AND column_name = 'id') = 'integer' THEN
    ALTER TABLE xassidas DROP CONSTRAINT IF EXISTS xassidas_pkey;
    ALTER TABLE xassidas ALTER COLUMN id TYPE TEXT USING id::TEXT;
    ALTER TABLE xassidas ADD PRIMARY KEY (id);
  END IF;
END $$;

-- ─── 4. Convert verses.xassida_id: INTEGER → TEXT ────────────────────────────

DO $$
BEGIN
  IF (SELECT data_type FROM information_schema.columns
      WHERE table_name = 'verses' AND column_name = 'xassida_id') = 'integer' THEN
    ALTER TABLE verses ALTER COLUMN xassida_id TYPE TEXT USING xassida_id::TEXT;
  END IF;
END $$;

-- ─── 5. Convert verses.id: SERIAL → TEXT (if still integer) ─────────────────

DO $$
BEGIN
  IF (SELECT data_type FROM information_schema.columns
      WHERE table_name = 'verses' AND column_name = 'id') = 'integer' THEN
    ALTER TABLE verses DROP CONSTRAINT IF EXISTS verses_pkey;
    ALTER TABLE verses ALTER COLUMN id TYPE TEXT USING id::TEXT;
    ALTER TABLE verses ADD PRIMARY KEY (id);
  END IF;
END $$;
