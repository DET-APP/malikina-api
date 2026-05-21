-- Migration 030: Table des questions sans réponse — pour que les admins enrichissent la base
CREATE TABLE IF NOT EXISTS unanswered_questions (
  id          SERIAL PRIMARY KEY,
  question    TEXT NOT NULL,
  asked_at    TIMESTAMP DEFAULT NOW(),
  answered    BOOLEAN DEFAULT FALSE,
  answered_at TIMESTAMP,
  answer      TEXT,
  chunk_id    UUID REFERENCES knowledge_chunks(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_unanswered_questions_answered ON unanswered_questions(answered);
CREATE INDEX IF NOT EXISTS idx_unanswered_questions_asked_at ON unanswered_questions(asked_at DESC);
