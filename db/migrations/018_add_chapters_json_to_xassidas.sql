-- Add chapters_json to store chapter names/icons for fiqh books
-- Format: { "1": { "name": "Introduction", "icon": "📖", "arabic": "المقدمة" }, "2": { ... } }
ALTER TABLE xassidas ADD COLUMN IF NOT EXISTS chapters_json JSONB DEFAULT '{}';
