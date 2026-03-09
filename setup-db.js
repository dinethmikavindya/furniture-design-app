const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function setupDatabase() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        console.log('Connecting to database...');
        const client = await pool.connect();
        console.log('Successfully connected.');

        console.log('Reading init-db.sql...');
        const sql = fs.readFileSync(path.join(__dirname, 'init-db.sql'), 'utf8');

        console.log('Executing initialization script...');
        await client.query(sql);
        console.log('Database schema initialized successfully.');

        client.release();
    } catch (err) {
        console.error('Error setting up database:', err.message);
        if (err.message.includes('ECONNREFUSED')) {
            console.error('\nERROR: Could not connect to PostgreSQL server at localhost:5432.');
            console.error('Please make sure PostgreSQL is installed and running.');
        }
    } finally {
        await pool.end();
    }
}

setupDatabase();
