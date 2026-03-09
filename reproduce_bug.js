const pkg = require('pg');
const { Pool } = pkg;
// require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: 'postgresql://postgres:211409@localhost:5432/furniture_db',
});

async function testQuery() {
    try {
        const email = 'nonexistent.user@example.com';
        console.log(`Checking email: ${email}`);
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email.toLowerCase()]
        );
        console.log('Result rows length:', existingUser.rows.length);
        console.log('Result rows:', existingUser.rows);

        if (existingUser.rows.length > 0) {
            console.log('BUG DETECTED: Email reported as registered but it should not be.');
        } else {
            console.log('NO BUG: Email is not registered.');
        }
    } catch (error) {
        console.error('Error during test:', error);
    } finally {
        await pool.end();
    }
}

testQuery();
