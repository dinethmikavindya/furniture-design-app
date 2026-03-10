import { HistoryManager } from './HistoryManager.js';

// Create history manager
const history = new HistoryManager();

console.log('=== UNDO/REDO SYSTEM TEST ===\n');

// Test 1: Save initial state
const state1 = {
    furniture: [
        { id: 1, x: 100, y: 100, type: 'chair' }
    ],
    roomConfig: { width: 400, height: 400 }
};
history.save(state1);
console.log('✅ Saved State 1:', state1);
console.log('Info:', history.getInfo());

// Test 2: Save second state
const state2 = {
    furniture: [
        { id: 1, x: 150, y: 150, type: 'chair' }
    ],
    roomConfig: { width: 400, height: 400 }
};
history.save(state2);
console.log('\n✅ Saved State 2:', state2);
console.log('Info:', history.getInfo());

// Test 3: Save third state
const state3 = {
    furniture: [
        { id: 1, x: 200, y: 200, type: 'chair' },
        { id: 2, x: 100, y: 100, type: 'table' }
    ],
    roomConfig: { width: 400, height: 400 }
};
history.save(state3);
console.log('\n✅ Saved State 3:', state3);
console.log('Info:', history.getInfo());

// Test 4: Undo
console.log('\n--- UNDO ---');
const undoState = history.undo();
console.log('After Undo:', undoState);
console.log('Info:', history.getInfo());

// Test 5: Undo again
console.log('\n--- UNDO AGAIN ---');
const undoState2 = history.undo();
console.log('After Undo:', undoState2);
console.log('Info:', history.getInfo());

// Test 6: Redo
console.log('\n--- REDO ---');
const redoState = history.redo();
console.log('After Redo:', redoState);
console.log('Info:', history.getInfo());

// Test 7: Save new state (this should clear redo history)
console.log('\n--- SAVE NEW STATE (CLEARS REDO) ---');
const state4 = {
    furniture: [
        { id: 1, x: 250, y: 250, type: 'chair' }
    ],
    roomConfig: { width: 400, height: 400 }
};
history.save(state4);
console.log('Saved State 4:', state4);
console.log('Info:', history.getInfo());

console.log('\n=== TEST COMPLETE ===');