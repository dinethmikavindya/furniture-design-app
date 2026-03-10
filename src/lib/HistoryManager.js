/**
 * HistoryManager - Manages undo/redo functionality
 * Stores state history and allows time-travel through states
 */

export class HistoryManager {
    constructor(maxHistorySize = 50) {
        this.history = [];           // Array of past states
        this.currentIndex = -1;      // Current position in history
        this.maxHistorySize = maxHistorySize; // Maximum states to keep
    }

    /**
     * Save a new state to history
     * @param {Object} state - The state to save (furniture positions, room config, etc.)
     */
    save(state) {
        // Remove any "future" states if we're not at the end
        this.history = this.history.slice(0, this.currentIndex + 1);

        // Deep clone the state to prevent reference issues
        const clonedState = JSON.parse(JSON.stringify(state));

        // Add new state
        this.history.push(clonedState);

        // Limit history size (remove oldest if exceeds max)
        if (this.history.length > this.maxHistorySize) {
            this.history.shift();
        } else {
            this.currentIndex++;
        }

        return this.currentIndex;
    }

    /**
     * Undo - go back one step
     * @returns {Object|null} Previous state or null if can't undo
     */
    undo() {
        if (!this.canUndo()) {
            return null;
        }

        this.currentIndex--;
        return this.getCurrentState();
    }

    /**
     * Redo - go forward one step
     * @returns {Object|null} Next state or null if can't redo
     */
    redo() {
        if (!this.canRedo()) {
            return null;
        }

        this.currentIndex++;
        return this.getCurrentState();
    }

    /**
     * Check if undo is possible
     * @returns {boolean}
     */
    canUndo() {
        return this.currentIndex > 0;
    }

    /**
     * Check if redo is possible
     * @returns {boolean}
     */
    canRedo() {
        return this.currentIndex < this.history.length - 1;
    }

    /**
     * Get current state
     * @returns {Object|null}
     */
    getCurrentState() {
        if (this.currentIndex >= 0 && this.currentIndex < this.history.length) {
            return JSON.parse(JSON.stringify(this.history[this.currentIndex]));
        }
        return null;
    }

    /**
     * Get history size
     * @returns {number}
     */
    getHistorySize() {
        return this.history.length;
    }

    /**
     * Clear all history
     */
    clear() {
        this.history = [];
        this.currentIndex = -1;
    }

    /**
     * Get info about current state
     * @returns {Object}
     */
    getInfo() {
        return {
            totalStates: this.history.length,
            currentIndex: this.currentIndex,
            canUndo: this.canUndo(),
            canRedo: this.canRedo(),
        };
    }
}