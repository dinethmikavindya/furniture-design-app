-- Add updated_at column if it doesn't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Add theme column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS theme VARCHAR(20) DEFAULT 'light';

-- Add preferences column (stores grid settings, etc.)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{"gridEnabled": true, "gridSize": 20}';

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_users_theme ON users(theme);

-- Update existing users to have default preferences (if they're null)
UPDATE users 
SET preferences = '{"gridEnabled": true, "gridSize": 20}'::jsonb
WHERE preferences IS NULL OR preferences = '{}'::jsonb;