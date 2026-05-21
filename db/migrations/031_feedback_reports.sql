-- Migration 031: Signalements de mauvaises réponses du chatbot
CREATE TABLE IF NOT EXISTS feedback_reports (
  id          SERIAL PRIMARY KEY,
  message     TEXT NOT NULL,
  bot_answer  TEXT NOT NULL,
  reported_at TIMESTAMP DEFAULT NOW(),
  reviewed    BOOLEAN DEFAULT FALSE,
  reviewed_at TIMESTAMP,
  note        TEXT
);

CREATE INDEX IF NOT EXISTS idx_feedback_reports_reviewed ON feedback_reports(reviewed);
CREATE INDEX IF NOT EXISTS idx_feedback_reports_reported_at ON feedback_reports(reported_at DESC);
