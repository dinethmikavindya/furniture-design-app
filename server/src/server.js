const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const pool = require('../database/config/database');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



app.get('/api/products', async (req, res) => {
    try {
        const { category } = req.query;

        let query = 'SELECT * FROM furniture_catalog';
        let queryParams = [];

        if (category && category.toLowerCase() !== 'all') {
            const catBase = category.toLowerCase().replace(/s$/, '');
            query += ' WHERE category ILIKE $1 OR category ILIKE $2';
            queryParams = [`%${catBase}%`, `%${category}%`];
        }

        const result = await pool.query(query, queryParams);

        console.log("result.rows");
        console.log(result.rows);

        const products = result.rows.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category.charAt(0).toUpperCase() + item.category.slice(1),
            price: item.category === 'sofa' ? 'Rs.150,000' :
                item.category === 'bed' ? 'Rs.200,000' :
                    item.category === 'table' ? 'Rs.45,000' : 'Rs.25,000',
            colors: item.available_colors || ["#1a1a1a", "#8b7355", "#c4a882"],
            thumbnailUrl: item.thumbnail_url,
            modelUrl: item.model_url
        }));

        res.json(products);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ error: 'Failed to fetch products from the database' });
    }
});

app.listen(port, () => {
    console.log(`Express server running on http://localhost:${port}`);
});
