const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('Database connection successful:', res.rows[0]);

        // Check if users table exists
        const tableCheck = await pool.query("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users')");
        console.log('Users table exists:', tableCheck.rows[0].exists);

        if (tableCheck.rows[0].exists) {
            const columns = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'users'");
            console.log('Columns in users table:', columns.rows.map(r => r.column_name));
        }

    } catch (err) {
        console.error('Database connection failed:', err.message);
    } finally {
        await pool.end();
    }
}

testConnection();
