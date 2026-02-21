import {
    snapToGrid,
    snapPointToGrid,
    getNearestGridPoint,
    isOnGrid,
    snapFurnitureToGrid,
    getGridLines
} from './gridSnap.js';

console.log('=== GRID SNAP SYSTEM TEST ===\n');

// Test 1: Snap single value
console.log('--- Test 1: snapToGrid ---');
console.log('47 snaps to:', snapToGrid(47, 20)); // Should be 40
console.log('53 snaps to:', snapToGrid(53, 20)); // Should be 60
console.log('100 snaps to:', snapToGrid(100, 20)); // Should be 100

// Test 2: Snap point
console.log('\n--- Test 2: snapPointToGrid ---');
const point = { x: 127, y: 83 };
console.log('Point:', point);
console.log('Snapped:', snapPointToGrid(point, 20)); // {x: 120, y: 80}

// Test 3: Get nearest grid point
console.log('\n--- Test 3: getNearestGridPoint ---');
console.log('Nearest to 47:', getNearestGridPoint(47, 20)); // 40
console.log('Nearest to 150:', getNearestGridPoint(150, 20)); // 150

// Test 4: Check if on grid
console.log('\n--- Test 4: isOnGrid ---');
console.log('{x: 100, y: 100} on grid?', isOnGrid({ x: 100, y: 100 }, 20)); // true
console.log('{x: 105, y: 100} on grid?', isOnGrid({ x: 105, y: 100 }, 20)); // false

// Test 5: Snap furniture
console.log('\n--- Test 5: snapFurnitureToGrid ---');
const furniture = {
    id: 1,
    x: 127,
    y: 83,
    width: 95,
    height: 73,
    type: 'chair'
};
console.log('Original:', furniture);
console.log('Snapped:', snapFurnitureToGrid(furniture, 20));

// Test 6: Get grid lines
console.log('\n--- Test 6: getGridLines ---');
const lines = getGridLines(200, 150, 20);
console.log('Vertical lines:', lines.vertical);
console.log('Horizontal lines:', lines.horizontal);

console.log('\n=== TEST COMPLETE ===');