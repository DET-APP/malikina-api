-- Migration: 013_add_xassida_visibility.sql
-- Purpose: Allow admins to show/hide xassidas from public listing

ALTER TABLE xassidas ADD COLUMN IF NOT EXISTS is_visible BOOLEAN NOT NULL DEFAULT true;

CREATE INDEX IF NOT EXISTS idx_xassidas_is_visible ON xassidas(is_visible);
