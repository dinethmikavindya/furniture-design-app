-- Sample furniture data for catalog
INSERT INTO furniture_catalog (name, category, width, height, depth, thumbnail_url, model_url, available_colors) VALUES
('Modern Sofa', 'sofa', 2.0, 0.8, 0.9, 'https://via.placeholder.com/150', 'https://example.com/models/sofa-modern.glb', '["#2C3E50", "#34495E", "#95A5A6", "#BDC3C7"]'),
('Classic Sofa', 'sofa', 2.2, 0.85, 0.95, 'https://via.placeholder.com/150', 'https://example.com/models/sofa-classic.glb', '["#8B4513", "#A0522D", "#D2691E"]'),
('L-Shaped Sofa', 'sofa', 2.5, 0.8, 2.0, 'https://via.placeholder.com/150', 'https://example.com/models/sofa-l-shaped.glb', '["#708090", "#778899", "#2F4F4F"]'),

('Dining Chair', 'chair', 0.5, 1.0, 0.5, 'https://via.placeholder.com/150', 'https://example.com/models/chair-dining.glb', '["#8B4513", "#A0522D", "#FFFFFF"]'),
('Office Chair', 'chair', 0.6, 1.1, 0.6, 'https://via.placeholder.com/150', 'https://example.com/models/chair-office.glb', '["#000000", "#2C3E50", "#E74C3C"]'),
('Armchair', 'chair', 0.8, 0.9, 0.8, 'https://via.placeholder.com/150', 'https://example.com/models/chair-arm.glb', '["#C0C0C0", "#808080", "#696969"]'),

('Coffee Table', 'table', 1.2, 0.5, 0.6, 'https://via.placeholder.com/150', 'https://example.com/models/table-coffee.glb', '["#8B4513", "#D2B48C", "#F5DEB3"]'),
('Dining Table', 'table', 1.8, 0.75, 0.9, 'https://via.placeholder.com/150', 'https://example.com/models/table-dining.glb', '["#654321", "#8B4513", "#A0522D"]'),
('Side Table', 'table', 0.5, 0.6, 0.5, 'https://via.placeholder.com/150', 'https://example.com/models/table-side.glb', '["#FFFFFF", "#F5F5DC", "#FFE4B5"]'),
('Desk', 'table', 1.4, 0.75, 0.7, 'https://via.placeholder.com/150', 'https://example.com/models/desk.glb', '["#000000", "#FFFFFF", "#8B4513"]'),

('Queen Bed', 'bed', 1.6, 0.5, 2.0, 'https://via.placeholder.com/150', 'https://example.com/models/bed-queen.glb', '["#FFFFFF", "#F5F5DC", "#D3D3D3"]'),
('King Bed', 'bed', 1.8, 0.5, 2.0, 'https://via.placeholder.com/150', 'https://example.com/models/bed-king.glb', '["#2F4F4F", "#696969", "#808080"]'),
('Single Bed', 'bed', 0.9, 0.5, 1.9, 'https://via.placeholder.com/150', 'https://example.com/models/bed-single.glb', '["#87CEEB", "#FFB6C1", "#FFFFFF"]'),

('Bookshelf', 'storage', 0.8, 1.8, 0.3, 'https://via.placeholder.com/150', 'https://example.com/models/bookshelf.glb', '["#8B4513", "#000000", "#FFFFFF"]'),
('Wardrobe', 'storage', 1.2, 2.0, 0.6, 'https://via.placeholder.com/150', 'https://example.com/models/wardrobe.glb', '["#FFFFFF", "#F5F5DC", "#8B4513"]'),
('TV Stand', 'storage', 1.5, 0.5, 0.4, 'https://via.placeholder.com/150', 'https://example.com/models/tv-stand.glb', '["#000000", "#8B4513", "#696969"]');