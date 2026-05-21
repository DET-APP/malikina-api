-- Ajouter une contrainte unique (source, title) sur knowledge_chunks
-- pour permettre ON CONFLICT (source, title) DO NOTHING lors de l'auto-enrichissement
ALTER TABLE knowledge_chunks
  ADD CONSTRAINT IF NOT EXISTS knowledge_chunks_source_title_unique UNIQUE (source, title);
