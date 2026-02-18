// Database connection for furniture design app
const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'furniture_db',
    user: 'dinithiwijesinghe',
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