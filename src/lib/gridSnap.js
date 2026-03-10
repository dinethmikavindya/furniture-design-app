/**
 * Grid Snap Utilities
 * Functions to snap furniture positions to grid
 */

/**
 * Snap a value to the nearest grid point
 * @param {number} value - The value to snap (x or y coordinate)
 * @param {number} gridSize - Size of grid squares (default 20)
 * @returns {number} Snapped value
 */
export function snapToGrid(value, gridSize = 20) {
    return Math.round(value / gridSize) * gridSize;
}

/**
 * Snap a point (x, y) to the nearest grid intersection
 * @param {Object} point - Point with x and y coordinates
 * @param {number} gridSize - Size of grid squares
 * @returns {Object} Snapped point {x, y}
 */
export function snapPointToGrid(point, gridSize = 20) {
    return {
        x: snapToGrid(point.x, gridSize),
        y: snapToGrid(point.y, gridSize)
    };
}

/**
 * Get the nearest grid point for a given coordinate
 * @param {number} value - The coordinate value
 * @param {number} gridSize - Size of grid squares
 * @returns {number} Nearest grid line position
 */
export function getNearestGridPoint(value, gridSize = 20) {
    return Math.round(value / gridSize) * gridSize;
}

/**
 * Check if a point is on a grid line
 * @param {Object} point - Point with x and y
 * @param {number} gridSize - Size of grid squares
 * @returns {boolean} True if on grid
 */
export function isOnGrid(point, gridSize = 20) {
    return (
        point.x % gridSize === 0 &&
        point.y % gridSize === 0
    );
}

/**
 * Snap furniture bounds to grid
 * @param {Object} furniture - Furniture object {x, y, width, height}
 * @param {number} gridSize - Size of grid squares
 * @returns {Object} Snapped furniture position
 */
export function snapFurnitureToGrid(furniture, gridSize = 20) {
    return {
        ...furniture,
        x: snapToGrid(furniture.x, gridSize),
        y: snapToGrid(furniture.y, gridSize),
        width: snapToGrid(furniture.width, gridSize),
        height: snapToGrid(furniture.height, gridSize)
    };
}

/**
 * Get grid lines for drawing
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} gridSize - Size of grid squares
 * @returns {Object} Object with vertical and horizontal lines
 */
export function getGridLines(width, height, gridSize = 20) {
    const verticalLines = [];
    const horizontalLines = [];

    // Vertical lines
    for (let x = 0; x <= width; x += gridSize) {
        verticalLines.push(x);
    }

    // Horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
        horizontalLines.push(y);
    }

    return {
        vertical: verticalLines,
        horizontal: horizontalLines
    };
}
