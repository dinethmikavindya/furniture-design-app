// Database connection for furniture design app
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://dinithiwijesinghe:password@localhost:5432/furniture_db',
});

pool.connect((err, client, done) => {
    if (err) {
        console.error('❌ Database connection failed:', err);
    } else {
        console.log('✅ Database connected successfully');
        done();
    }
});

module.exports = pool;