-- Add is_fiqh flag to mark xassidas as Fiqh books (e.g., Fakihatou Tullab)
ALTER TABLE xassidas ADD COLUMN IF NOT EXISTS is_fiqh BOOLEAN DEFAULT FALSE;

-- Create index for efficient filtering
CREATE INDEX IF NOT EXISTS idx_xassidas_is_fiqh ON xassidas(is_fiqh) WHERE is_fiqh = true;
