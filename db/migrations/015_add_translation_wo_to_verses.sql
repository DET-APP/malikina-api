-- Migration: 015_add_translation_wo_to_verses.sql
-- Purpose: Add Wolof translation column to verses table

ALTER TABLE verses ADD COLUMN IF NOT EXISTS translation_wo TEXT;
