import { NextResponse } from 'next/server';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

/**
 * SEARCH furniture by name or category
 * GET /api/furniture/search?q=sofa&limit=20
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        const limit = parseInt(searchParams.get('limit')) || 20;
        const offset = parseInt(searchParams.get('offset')) || 0;

        if (!query || query.trim() === '') {
            return NextResponse.json(
                { error: 'Search query required' },
                { status: 400 }
            );
        }

        const searchTerm = `%${query.toLowerCase()}%`;

        const result = await pool.query(
            `SELECT * FROM furniture_catalog 
       WHERE LOWER(name) LIKE $1 
          OR LOWER(category) LIKE $1 
       ORDER BY name ASC 
       LIMIT $2 OFFSET $3`,
            [searchTerm, limit, offset]
        );

        // Get count
        const countResult = await pool.query(
            `SELECT COUNT(*) FROM furniture_catalog 
       WHERE LOWER(name) LIKE $1 OR LOWER(category) LIKE $1`,
            [searchTerm]
        );
        const total = parseInt(countResult.rows[0].count);

        return NextResponse.json({
            query,
            furniture: result.rows,
            pagination: {
                total,
                limit,
                offset,
                hasMore: offset + limit < total
            }
        });

    } catch (error) {
        console.error('Furniture Search Error:', error);
        return NextResponse.json(
            { error: 'Failed to search furniture', details: error.message },
            { status: 500 }
        );
    }
}