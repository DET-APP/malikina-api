-- Migration: 003_add_audio_trimming.sql
-- Created: 2026-04-16
-- Purpose: Add start_time and end_time fields to xassida_audios for audio calibration

-- Add timing columns to xassida_audios table
ALTER TABLE xassida_audios 
  ADD COLUMN IF NOT EXISTS start_time INTEGER DEFAULT 0,  -- In seconds
  ADD COLUMN IF NOT EXISTS end_time INTEGER DEFAULT NULL;  -- In seconds, NULL = use full duration

-- Add comment to explain the fields
COMMENT ON COLUMN xassida_audios.start_time IS 'Start time in seconds (0 = beginning)';
COMMENT ON COLUMN xassida_audios.end_time IS 'End time in seconds (NULL = full duration)';

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_xassida_audios_timing ON xassida_audios(xassida_id, start_time, end_time);
