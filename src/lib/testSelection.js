import { SelectionManager } from './SelectionManager.js';

console.log('=== MULTI-SELECT SYSTEM TEST ===\n');

// Sample furniture items
const furniture = [
    { id: 1, type: 'chair', x: 100, y: 100, width: 80, height: 80, color: '#8B4513' },
    { id: 2, type: 'table', x: 200, y: 200, width: 120, height: 80, color: '#654321' },
    { id: 3, type: 'sofa', x: 400, y: 300, width: 200, height: 100, color: '#A0826D' },
    { id: 4, type: 'chair', x: 150, y: 400, width: 80, height: 80, color: '#8B4513' }
];

const selection = new SelectionManager();

// Test 1: Select single item
console.log('--- Test 1: Select single items ---');
selection.select(1);
console.log('Selected item 1:', selection.getSelected());
console.log('Is item 1 selected?', selection.isSelected(1));
console.log('Count:', selection.getCount());

// Test 2: Select multiple
console.log('\n--- Test 2: Select multiple ---');
selection.select(2);
selection.select(3);
console.log('Selected:', selection.getSelected());
console.log('Count:', selection.getCount());

// Test 3: Toggle selection
console.log('\n--- Test 3: Toggle ---');
selection.toggle(2); // Deselect
console.log('After toggling item 2:', selection.getSelected());
selection.toggle(2); // Re-select
console.log('After toggling item 2 again:', selection.getSelected());

// Test 4: Select all
console.log('\n--- Test 4: Select all ---');
selection.selectAll(furniture);
console.log('Selected all:', selection.getSelected());
console.log('Count:', selection.getCount());

// Test 5: Clear selection
console.log('\n--- Test 5: Clear all ---');
selection.clearAll();
console.log('After clear:', selection.getSelected());
console.log('Count:', selection.getCount());

// Test 6: Bulk move
console.log('\n--- Test 6: Bulk move ---');
selection.select(1);
selection.select(2);
console.log('Selected items 1 and 2');
const movedFurniture = selection.bulkMove(furniture, { dx: 50, dy: 50 });
console.log('Original item 1:', furniture[0]);
console.log('Moved item 1:', movedFurniture[0]);
console.log('Original item 3 (not selected):', furniture[2]);
console.log('Item 3 after move (unchanged):', movedFurniture[2]);

// Test 7: Bulk color change
console.log('\n--- Test 7: Bulk color change ---');
const coloredFurniture = selection.bulkColor(furniture, '#FF0000');
console.log('Item 1 color (selected):', coloredFurniture[0].color);
console.log('Item 3 color (not selected):', coloredFurniture[2].color);

// Test 8: Bulk delete
console.log('\n--- Test 8: Bulk delete ---');
console.log('Before delete:', furniture.length, 'items');
const afterDelete = selection.bulkDelete(furniture);
console.log('After delete:', afterDelete.length, 'items');
console.log('Remaining items:', afterDelete.map(f => f.id));

// Test 9: Selection bounds
console.log('\n--- Test 9: Selection bounds ---');
selection.clearAll();
selection.select(1);
selection.select(2);
const bounds = selection.getSelectionBounds(furniture);
console.log('Bounds of items 1 and 2:', bounds);

// Test 10: Area selection
console.log('\n--- Test 10: Area selection ---');
selection.clearAll();
const selectionRect = { x: 90, y: 90, width: 250, height: 250 };
selection.selectInArea(selectionRect, furniture);
console.log('Items in selection area:', selection.getSelected());

console.log('\n=== TEST COMPLETE ===');