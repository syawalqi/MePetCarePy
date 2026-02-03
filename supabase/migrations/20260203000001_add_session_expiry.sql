-- Add expires_at column to user_sessions for absolute session timeouts

ALTER TABLE user_sessions
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;

-- Backfill existing sessions (give them 1 hour from now so they don't instantly expire)
UPDATE user_sessions
SET expires_at = NOW() + INTERVAL '1 hour'
WHERE expires_at IS NULL;

-- Make it NOT NULL after backfilling
ALTER TABLE user_sessions
ALTER COLUMN expires_at SET NOT NULL;
