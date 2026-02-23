-- Update user preferences to include all settings fields
UPDATE users 
SET preferences = jsonb_set(
  jsonb_set(
    jsonb_set(
      COALESCE(preferences, '{}'::jsonb),
      '{measurementSystem}',
      '"metric"'
    ),
    '{ceilingHeight}',
    '240'
  ),
  '{snapToGrid}',
  'false'
)
WHERE preferences IS NULL 
   OR NOT preferences ? 'measurementSystem' 
   OR NOT preferences ? 'ceilingHeight'
   OR NOT preferences ? 'snapToGrid';

-- Ensure all existing users have the new fields
UPDATE users
SET preferences = preferences || 
  jsonb_build_object(
    'measurementSystem', COALESCE(preferences->>'measurementSystem', 'metric'),
    'ceilingHeight', COALESCE((preferences->>'ceilingHeight')::int, 240),
    'snapToGrid', COALESCE((preferences->>'snapToGrid')::boolean, false),
    'gridEnabled', COALESCE((preferences->>'gridEnabled')::boolean, true),
    'gridSize', COALESCE((preferences->>'gridSize')::int, 20)
  )
WHERE preferences IS NOT NULL;