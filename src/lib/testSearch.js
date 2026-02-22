import {
    searchFurniture,
    filterByCategory,
    filterBySize,
    filterByColor,
    sortFurniture,
    searchAndFilter,
    getCategories,
    getAvailableColors,
    getPriceRange
} from './furnitureSearch.js';

console.log('=== SEARCH & FILTER SYSTEM TEST ===\n');

// Sample furniture catalog
const catalog = [
    { id: 1, name: 'Office Chair', type: 'chair', category: 'chairs', width: 50, height: 50, color: '#8B4513', price: 150 },
    { id: 2, name: 'Dining Chair', type: 'chair', category: 'chairs', width: 45, height: 45, color: '#654321', price: 120 },
    { id: 3, name: 'Dining Table', type: 'table', category: 'tables', width: 160, height: 100, color: '#8B7355', price: 450 },
    { id: 4, name: 'Coffee Table', type: 'table', category: 'tables', width: 120, height: 80, color: '#A0826D', price: 280 },
    { id: 5, name: 'Side Table', type: 'table', category: 'tables', width: 60, height: 60, color: '#8B7355', price: 150 },
    { id: 6, name: 'Leather Sofa', type: 'sofa', category: 'sofas', width: 200, height: 100, color: '#654321', price: 800 },
    { id: 7, name: 'Armchair', type: 'chair', category: 'chairs', width: 80, height: 80, color: '#8B4513', price: 350 }
];

// Test 1: Search by name
console.log('--- Test 1: Search by name ---');
const searchResults = searchFurniture(catalog, 'chair');
console.log('Search "chair":', searchResults.map(f => f.name));

// Test 2: Filter by category
console.log('\n--- Test 2: Filter by category ---');
const chairs = filterByCategory(catalog, 'chairs');
console.log('Chairs:', chairs.map(f => f.name));

const tables = filterByCategory(catalog, 'tables');
console.log('Tables:', tables.map(f => f.name));

// Test 3: Filter by size
console.log('\n--- Test 3: Filter by size ---');
const smallItems = filterBySize(catalog, { maxWidth: 80, maxHeight: 80 });
console.log('Small items (≤80x80):', smallItems.map(f => f.name));

const largeItems = filterBySize(catalog, { minWidth: 100 });
console.log('Large items (width ≥100):', largeItems.map(f => f.name));

// Test 4: Filter by color
console.log('\n--- Test 4: Filter by color ---');
const brownItems = filterByColor(catalog, ['#8B4513', '#654321']);
console.log('Brown items:', brownItems.map(f => f.name));

// Test 5: Sort by name
console.log('\n--- Test 5: Sort by name ---');
const sortedByName = sortFurniture(catalog, 'name', 'asc');
console.log('Sorted A-Z:', sortedByName.map(f => f.name));

// Test 6: Sort by size
console.log('\n--- Test 6: Sort by size ---');
const sortedBySize = sortFurniture(catalog, 'size', 'desc');
console.log('Sorted by size (largest first):', sortedBySize.map(f => `${f.name} (${f.width}x${f.height})`));

// Test 7: Sort by price
console.log('\n--- Test 7: Sort by price ---');
const sortedByPrice = sortFurniture(catalog, 'price', 'asc');
console.log('Sorted by price (lowest first):', sortedByPrice.map(f => `${f.name} ($${f.price})`));

// Test 8: Combined search and filter
console.log('\n--- Test 8: Combined search and filter ---');
const combined = searchAndFilter(catalog, {
    search: 'table',
    category: 'tables',
    sortBy: 'price',
    sortOrder: 'asc'
});
console.log('Tables sorted by price:', combined.map(f => `${f.name} ($${f.price})`));

// Test 9: Complex filter
console.log('\n--- Test 9: Complex filter ---');
const complex = searchAndFilter(catalog, {
    category: 'chairs',
    sizeRange: { maxWidth: 60 },
    sortBy: 'price',
    sortOrder: 'desc'
});
console.log('Small chairs, expensive first:', complex.map(f => `${f.name} (${f.width}x${f.height}, $${f.price})`));

// Test 10: Get categories
console.log('\n--- Test 10: Get unique categories ---');
const categories = getCategories(catalog);
console.log('Available categories:', categories);

// Test 11: Get colors
console.log('\n--- Test 11: Get available colors ---');
const colors = getAvailableColors(catalog);
console.log('Available colors:', colors);

// Test 12: Get price range
console.log('\n--- Test 12: Get price range ---');
const priceRange = getPriceRange(catalog);
console.log('Price range: $' + priceRange.min + ' - $' + priceRange.max);

console.log('\n=== TEST COMPLETE ===');