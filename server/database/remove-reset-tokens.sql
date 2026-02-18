-- Remove password reset token fields from users table
ALTER TABLE users 
DROP COLUMN IF EXISTS reset_token,
DROP COLUMN IF EXISTS reset_token_expires;

-- Remove index
DROP INDEX IF EXISTS idx_users_reset_token;