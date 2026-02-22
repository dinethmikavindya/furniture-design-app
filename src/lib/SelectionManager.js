/**
 * SelectionManager - Manages multi-select functionality
 * Allows selecting multiple furniture items and performing bulk operations
 */

export class SelectionManager {
    constructor() {
        this.selectedIds = new Set(); // Use Set for fast lookups
    }

    /**
     * Select a single item
     * @param {string|number} id - Item ID to select
     */
    select(id) {
        this.selectedIds.add(id);
        return Array.from(this.selectedIds);
    }

    /**
     * Deselect a single item
     * @param {string|number} id - Item ID to deselect
     */
    deselect(id) {
        this.selectedIds.delete(id);
        return Array.from(this.selectedIds);
    }

    /**
     * Toggle selection of an item
     * @param {string|number} id - Item ID to toggle
     */
    toggle(id) {
        if (this.selectedIds.has(id)) {
            this.selectedIds.delete(id);
        } else {
            this.selectedIds.add(id);
        }
        return Array.from(this.selectedIds);
    }

    /**
     * Select multiple items
     * @param {Array} ids - Array of item IDs to select
     */
    selectMultiple(ids) {
        ids.forEach(id => this.selectedIds.add(id));
        return Array.from(this.selectedIds);
    }

    /**
     * Select all items
     * @param {Array} allItems - Array of all items
     */
    selectAll(allItems) {
        allItems.forEach(item => this.selectedIds.add(item.id));
        return Array.from(this.selectedIds);
    }

    /**
     * Clear all selections
     */
    clearAll() {
        this.selectedIds.clear();
        return [];
    }

    /**
     * Check if an item is selected
     * @param {string|number} id - Item ID to check
     */
    isSelected(id) {
        return this.selectedIds.has(id);
    }

    /**
     * Get all selected IDs
     */
    getSelected() {
        return Array.from(this.selectedIds);
    }

    /**
     * Get count of selected items
     */
    getCount() {
        return this.selectedIds.size;
    }

    /**
     * Check if any items are selected
     */
    hasSelection() {
        return this.selectedIds.size > 0;
    }

    /**
     * Select items within a rectangular area (drag selection)
     * @param {Object} rect - Selection rectangle {x, y, width, height}
     * @param {Array} items - All items to check
     */
    selectInArea(rect, items) {
        items.forEach(item => {
            // Check if item overlaps with selection rectangle
            const itemRight = item.x + item.width;
            const itemBottom = item.y + item.height;
            const rectRight = rect.x + rect.width;
            const rectBottom = rect.y + rect.height;

            const overlaps = !(
                item.x > rectRight ||
                itemRight < rect.x ||
                item.y > rectBottom ||
                itemBottom < rect.y
            );

            if (overlaps) {
                this.selectedIds.add(item.id);
            }
        });

        return Array.from(this.selectedIds);
    }

    /**
     * BULK OPERATIONS
     */

    /**
     * Move all selected items by offset
     * @param {Array} items - All furniture items
     * @param {Object} offset - {dx, dy} movement offset
     */
    bulkMove(items, offset) {
        return items.map(item => {
            if (this.selectedIds.has(item.id)) {
                return {
                    ...item,
                    x: item.x + offset.dx,
                    y: item.y + offset.dy
                };
            }
            return item;
        });
    }

    /**
     * Delete all selected items
     * @param {Array} items - All furniture items
     */
    bulkDelete(items) {
        const remaining = items.filter(item => !this.selectedIds.has(item.id));
        this.selectedIds.clear();
        return remaining;
    }

    /**
     * Change color of all selected items
     * @param {Array} items - All furniture items
     * @param {string} color - New color
     */
    bulkColor(items, color) {
        return items.map(item => {
            if (this.selectedIds.has(item.id)) {
                return {
                    ...item,
                    color: color
                };
            }
            return item;
        });
    }

    /**
     * Rotate all selected items
     * @param {Array} items - All furniture items
     * @param {number} degrees - Rotation amount in degrees
     */
    bulkRotate(items, degrees) {
        return items.map(item => {
            if (this.selectedIds.has(item.id)) {
                return {
                    ...item,
                    rotation: (item.rotation || 0) + degrees
                };
            }
            return item;
        });
    }

    /**
     * Scale all selected items
     * @param {Array} items - All furniture items
     * @param {number} scaleFactor - Scale multiplier (e.g., 1.2 = 120%)
     */
    bulkScale(items, scaleFactor) {
        return items.map(item => {
            if (this.selectedIds.has(item.id)) {
                return {
                    ...item,
                    width: item.width * scaleFactor,
                    height: item.height * scaleFactor
                };
            }
            return item;
        });
    }

    /**
     * Get all selected items (full objects)
     * @param {Array} items - All furniture items
     */
    getSelectedItems(items) {
        return items.filter(item => this.selectedIds.has(item.id));
    }

    /**
     * Get selection bounds (bounding box of all selected items)
     * @param {Array} items - All furniture items
     */
    getSelectionBounds(items) {
        const selectedItems = this.getSelectedItems(items);

        if (selectedItems.length === 0) {
            return null;
        }

        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        selectedItems.forEach(item => {
            minX = Math.min(minX, item.x);
            minY = Math.min(minY, item.y);
            maxX = Math.max(maxX, item.x + item.width);
            maxY = Math.max(maxY, item.y + item.height);
        });

        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        };
    }
}