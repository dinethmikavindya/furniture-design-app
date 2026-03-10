/**
 * Furniture Search & Filter System
 * Functions to search and filter furniture catalog
 */

/**
 * Search furniture by name or type
 * @param {Array} furnitureList - Array of furniture items
 * @param {string} searchTerm - Search query
 * @returns {Array} Filtered furniture
 */
export function searchFurniture(furnitureList, searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
        return furnitureList;
    }

    const term = searchTerm.toLowerCase().trim();

    return furnitureList.filter(item => {
        const name = (item.name || '').toLowerCase();
        const type = (item.type || '').toLowerCase();
        const category = (item.category || '').toLowerCase();

        return name.includes(term) ||
            type.includes(term) ||
            category.includes(term);
    });
}

/**
 * Filter furniture by category
 * @param {Array} furnitureList - Array of furniture items
 * @param {string} category - Category to filter by
 * @returns {Array} Filtered furniture
 */
export function filterByCategory(furnitureList, category) {
    if (!category || category === 'all') {
        return furnitureList;
    }

    return furnitureList.filter(item =>
        (item.category || '').toLowerCase() === category.toLowerCase()
    );
}

/**
 * Filter furniture by size range
 * @param {Array} furnitureList - Array of furniture items
 * @param {Object} sizeRange - {minWidth, maxWidth, minHeight, maxHeight}
 * @returns {Array} Filtered furniture
 */
export function filterBySize(furnitureList, sizeRange) {
    const { minWidth, maxWidth, minHeight, maxHeight } = sizeRange;

    return furnitureList.filter(item => {
        const widthMatch = (!minWidth || item.width >= minWidth) &&
            (!maxWidth || item.width <= maxWidth);
        const heightMatch = (!minHeight || item.height >= minHeight) &&
            (!maxHeight || item.height <= maxHeight);

        return widthMatch && heightMatch;
    });
}

/**
 * Filter furniture by color
 * @param {Array} furnitureList - Array of furniture items
 * @param {Array} colors - Array of color values to match
 * @returns {Array} Filtered furniture
 */
export function filterByColor(furnitureList, colors) {
    if (!colors || colors.length === 0) {
        return furnitureList;
    }

    return furnitureList.filter(item => {
        const itemColor = (item.color || item.defaultColor || '').toLowerCase();
        return colors.some(color => itemColor === color.toLowerCase());
    });
}

/**
 * Filter furniture by price range
 * @param {Array} furnitureList - Array of furniture items
 * @param {Object} priceRange - {min, max}
 * @returns {Array} Filtered furniture
 */
export function filterByPrice(furnitureList, priceRange) {
    const { min, max } = priceRange;

    return furnitureList.filter(item => {
        const price = item.price || 0;
        const minMatch = !min || price >= min;
        const maxMatch = !max || price <= max;
        return minMatch && maxMatch;
    });
}

/**
 * Sort furniture
 * @param {Array} furnitureList - Array of furniture items
 * @param {string} sortBy - Field to sort by ('name', 'size', 'price', 'popularity')
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array} Sorted furniture
 */
export function sortFurniture(furnitureList, sortBy = 'name', order = 'asc') {
    const sorted = [...furnitureList].sort((a, b) => {
        let compareValue = 0;

        switch (sortBy) {
            case 'name':
                compareValue = (a.name || '').localeCompare(b.name || '');
                break;
            case 'size':
                const sizeA = (a.width || 0) * (a.height || 0);
                const sizeB = (b.width || 0) * (b.height || 0);
                compareValue = sizeA - sizeB;
                break;
            case 'price':
                compareValue = (a.price || 0) - (b.price || 0);
                break;
            case 'popularity':
                compareValue = (a.usageCount || 0) - (b.usageCount || 0);
                break;
            default:
                compareValue = 0;
        }

        return order === 'desc' ? -compareValue : compareValue;
    });

    return sorted;
}

/**
 * Combined search and filter with multiple criteria
 * @param {Array} furnitureList - Array of furniture items
 * @param {Object} criteria - {search, category, sizeRange, colors, priceRange, sortBy, sortOrder}
 * @returns {Array} Filtered and sorted furniture
 */
export function searchAndFilter(furnitureList, criteria) {
    let result = furnitureList;

    // Apply search
    if (criteria.search) {
        result = searchFurniture(result, criteria.search);
    }

    // Apply category filter
    if (criteria.category) {
        result = filterByCategory(result, criteria.category);
    }

    // Apply size filter
    if (criteria.sizeRange) {
        result = filterBySize(result, criteria.sizeRange);
    }

    // Apply color filter
    if (criteria.colors && criteria.colors.length > 0) {
        result = filterByColor(result, criteria.colors);
    }

    // Apply price filter
    if (criteria.priceRange) {
        result = filterByPrice(result, criteria.priceRange);
    }

    // Apply sorting
    if (criteria.sortBy) {
        result = sortFurniture(result, criteria.sortBy, criteria.sortOrder || 'asc');
    }

    return result;
}

/**
 * Get unique categories from furniture list
 * @param {Array} furnitureList - Array of furniture items
 * @returns {Array} Unique categories
 */
export function getCategories(furnitureList) {
    const categories = new Set();
    furnitureList.forEach(item => {
        if (item.category) {
            categories.add(item.category);
        }
    });
    return Array.from(categories).sort();
}

/**
 * Get unique colors from furniture list
 * @param {Array} furnitureList - Array of furniture items
 * @returns {Array} Unique colors
 */
export function getAvailableColors(furnitureList) {
    const colors = new Set();
    furnitureList.forEach(item => {
        const color = item.color || item.defaultColor;
        if (color) {
            colors.add(color);
        }
    });
    return Array.from(colors);
}

/**
 * Get price range from furniture list
 * @param {Array} furnitureList - Array of furniture items
 * @returns {Object} {min, max}
 */
export function getPriceRange(furnitureList) {
    if (furnitureList.length === 0) {
        return { min: 0, max: 0 };
    }

    const prices = furnitureList.map(item => item.price || 0);
    return {
        min: Math.min(...prices),
        max: Math.max(...prices)
    };
}