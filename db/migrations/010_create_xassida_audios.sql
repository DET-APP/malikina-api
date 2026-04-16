-- Migration: 010_create_xassida_audios.sql
-- Created: 2026-04-16
-- Purpose: Table d'audios multiples par xassida avec support par chapitre et récitateur

CREATE TABLE IF NOT EXISTS xassida_audios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  xassida_id TEXT NOT NULL,
  -- NULL = audio pour toute la xassida, sinon numéro du chapitre
  chapter_number INTEGER DEFAULT NULL,
  reciter_name VARCHAR(255) NOT NULL,
  youtube_id VARCHAR(50) DEFAULT NULL,
  audio_url TEXT DEFAULT NULL,
  -- Libellé optionnel affiché dans le sélecteur (ex: "Récitation lente")
  label VARCHAR(255) DEFAULT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_xassida_audios_source CHECK (youtube_id IS NOT NULL OR audio_url IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_xassida_audios_xassida ON xassida_audios(xassida_id);
CREATE INDEX IF NOT EXISTS idx_xassida_audios_chapter ON xassida_audios(xassida_id, chapter_number);
