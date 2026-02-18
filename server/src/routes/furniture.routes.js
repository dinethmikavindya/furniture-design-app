const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET all furniture items
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;

        let query = 'SELECT * FROM furniture_catalog';
        let params = [];

        if (category) {
            query += ' WHERE category = $1';
            params.push(category);
        }

        query += ' ORDER BY category, name';

        const result = await pool.query(query, params);

        res.json({ furniture: result.rows });

    } catch (error) {
        console.error('Get furniture error:', error);
        res.status(500).json({ error: 'Failed to get furniture' });
    }
});

// GET furniture categories
router.get('/categories', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT DISTINCT category FROM furniture_catalog ORDER BY category'
        );

        const categories = result.rows.map(row => row.category);

        res.json({ categories });

    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ error: 'Failed to get categories' });
    }
});

module.exports = router;