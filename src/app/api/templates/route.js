import { NextResponse } from 'next/server';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

/**
 * GET all templates
 * GET /api/templates?category=Living%20Room
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');

        let query = 'SELECT * FROM templates';
        const values = [];

        if (category) {
            query += ' WHERE category = $1';
            values.push(category);
        }

        query += ' ORDER BY created_at DESC';

        const result = await pool.query(query, values);

        return NextResponse.json({
            templates: result.rows
        });

    } catch (error) {
        console.error('Templates GET Error:', error);
        return NextResponse.json(
            { error: 'Failed to get templates', details: error.message },
            { status: 500 }
        );
    }
}