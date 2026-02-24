-- Create templates table
CREATE TABLE IF NOT EXISTS templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    thumbnail_url TEXT,
    room_config JSONB NOT NULL,
    furniture_items JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert seed templates
INSERT INTO templates (id, name, description, category, thumbnail_url, room_config, furniture_items) VALUES

-- Modern Living Room
(
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    'Modern Living Room',
    'A contemporary living space with clean lines and neutral tones',
    'Living Room',
    'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Modern+Living',
    '{"width": 500, "height": 400, "ceilingHeight": 280, "wallColor": "#F5F5F0", "floorColor": "#D4C4B0"}',
    '[
        {
            "id": "temp-sofa-1",
            "furnitureId": "sofa-modern",
            "position": {"x": 150, "y": 200, "z": 0},
            "rotation": 0,
            "scale": 1,
            "color": "#2C3E50",
            "width": 220,
            "depth": 90
        },
        {
            "id": "temp-table-1",
            "furnitureId": "table-coffee",
            "position": {"x": 250, "y": 150, "z": 0},
            "rotation": 0,
            "scale": 1,
            "color": "#8B4513",
            "width": 120,
            "depth": 60
        },
        {
            "id": "temp-chair-1",
            "furnitureId": "chair-arm",
            "position": {"x": 350, "y": 200, "z": 0},
            "rotation": 270,
            "scale": 1,
            "color": "#696969",
            "width": 80,
            "depth": 80
        }
    ]'
),

-- Cozy Bedroom
(
    'b2c3d4e5-f6a7-4b5c-8d9e-0f1a2b3c4d5e',
    'Cozy Bedroom',
    'A warm and inviting bedroom design',
    'Bedroom',
    'https://via.placeholder.com/400x300/ec4899/ffffff?text=Cozy+Bedroom',
    '{"width": 450, "height": 400, "ceilingHeight": 260, "wallColor": "#E8D5C4", "floorColor": "#8B7355"}',
    '[
        {
            "id": "temp-bed-1",
            "furnitureId": "bed-queen",
            "position": {"x": 225, "y": 300, "z": 0},
            "rotation": 0,
            "scale": 1,
            "color": "#FFFFFF",
            "width": 200,
            "depth": 220
        },
        {
            "id": "temp-nightstand-1",
            "furnitureId": "table-side",
            "position": {"x": 100, "y": 300, "z": 0},
            "rotation": 0,
            "scale": 1,
            "color": "#8B4513",
            "width": 50,
            "depth": 40
        },
        {
            "id": "temp-nightstand-2",
            "furnitureId": "table-side",
            "position": {"x": 350, "y": 300, "z": 0},
            "rotation": 0,
            "scale": 1,
            "color": "#8B4513",
            "width": 50,
            "depth": 40
        }
    ]'
),

-- Home Office Setup
(
    'c3d4e5f6-a7b8-4c5d-9e0f-1a2b3c4d5e6f',
    'Home Office Setup',
    'A productive workspace with desk and storage',
    'Office',
    'https://via.placeholder.com/400x300/60a5fa/ffffff?text=Home+Office',
    '{"width": 400, "height": 350, "ceilingHeight": 240, "wallColor": "#E8F4FF", "floorColor": "#B8C5D6"}',
    '[
        {
            "id": "temp-desk-1",
            "furnitureId": "desk",
            "position": {"x": 200, "y": 250, "z": 0},
            "rotation": 180,
            "scale": 1,
            "color": "#000000",
            "width": 140,
            "depth": 70
        },
        {
            "id": "temp-chair-2",
            "furnitureId": "chair-office",
            "position": {"x": 200, "y": 150, "z": 0},
            "rotation": 0,
            "scale": 1,
            "color": "#000000",
            "width": 60,
            "depth": 60
        },
        {
            "id": "temp-shelf-1",
            "furnitureId": "bookshelf",
            "position": {"x": 80, "y": 200, "z": 0},
            "rotation": 90,
            "scale": 1,
            "color": "#8B4513",
            "width": 80,
            "depth": 30
        }
    ]'
),

-- Minimal Studio
(
    'd4e5f6a7-b8c9-4d5e-0f1a-2b3c4d5e6f7a',
    'Minimal Studio',
    'A minimalist studio apartment layout',
    'Studio',
    'https://via.placeholder.com/400x300/a78bfa/ffffff?text=Minimal+Studio',
    '{"width": 550, "height": 450, "ceilingHeight": 260, "wallColor": "#FFFFFF", "floorColor": "#F0F0F0"}',
    '[
        {
            "id": "temp-sofa-2",
            "furnitureId": "sofa-l-shaped",
            "position": {"x": 150, "y": 200, "z": 0},
            "rotation": 0,
            "scale": 1,
            "color": "#708090",
            "width": 250,
            "depth": 200
        },
        {
            "id": "temp-table-2",
            "furnitureId": "table-dining",
            "position": {"x": 400, "y": 350, "z": 0},
            "rotation": 0,
            "scale": 1,
            "color": "#D2B48C",
            "width": 120,
            "depth": 80
        }
    ]'
);