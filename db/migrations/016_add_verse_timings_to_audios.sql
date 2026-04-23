-- Migration: 016_add_verse_timings_to_audios.sql
-- Purpose: Store per-verse timestamps for audio sync (karaoke mode)
-- Format: {"1": 0, "2": 45, "3": 90} — verse_number -> seconds from trimmed audio start

ALTER TABLE xassida_audios ADD COLUMN IF NOT EXISTS verse_timings JSONB DEFAULT NULL;
