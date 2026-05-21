-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Knowledge chunks: textes tidianes découpés + embeddings
CREATE TABLE IF NOT EXISTS knowledge_chunks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source      TEXT NOT NULL,        -- ex: "Jawahirul Ma'ani", "Munyat al-Murid"
  source_url  TEXT,
  title       TEXT,
  language    TEXT DEFAULT 'ar',    -- ar | fr | wo
  content     TEXT NOT NULL,
  embedding   vector(384),          -- dimension all-MiniLM-L6-v2
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Index HNSW pour la recherche vectorielle rapide
CREATE INDEX IF NOT EXISTS knowledge_chunks_embedding_idx
  ON knowledge_chunks USING hnsw (embedding vector_cosine_ops);

-- Index texte pour recherche hybride
CREATE INDEX IF NOT EXISTS knowledge_chunks_content_idx
  ON knowledge_chunks USING gin(to_tsvector('simple', content));
