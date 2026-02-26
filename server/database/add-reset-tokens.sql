-- Add reset token fields to users table
ALTER TABLE users
ADD COLUMN reset_token VARCHAR(255),
ADD COLUMN reset_token_expires TIMESTAMP;

-- Add index for faster lookup
CREATE INDEX idx_users_reset_token ON users(reset_token);