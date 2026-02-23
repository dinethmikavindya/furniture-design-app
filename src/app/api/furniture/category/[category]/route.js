import { NextResponse } from 'next/server';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

/**
 * GET furniture by category
 * GET /api/furniture/category/:category
 */
export async function GET(request, { params }) {
    try {
        const { category } = params;
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit')) || 50;
        const offset = parseInt(searchParams.get('offset')) || 0;

        const query = await pool.query(
            `SELECT * FROM furniture_catalog 
       WHERE category = $1 
       ORDER BY name ASC 
       LIMIT $2 OFFSET $3`,
            [category, limit, offset]
        );

        // Get count
        const countResult = await pool.query(
            'SELECT COUNT(*) FROM furniture_catalog WHERE category = $1',
            [category]
        );
        const total = parseInt(countResult.rows[0].count);

        return NextResponse.json({
            category,
            furniture: query.rows,
            pagination: {
                total,
                limit,
                offset,
                hasMore: offset + limit < total
            }
        });

    } catch (error) {
        console.error('Category Filter Error:', error);
        return NextResponse.json(
            { error: 'Failed to filter by category', details: error.message },
            { status: 500 }
        );
    }
}