import { NextResponse } from 'next/server';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

/**
 * GET all furniture from catalog
 * GET /api/furniture?limit=50&offset=0&category=chairs
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit')) || 50;
        const offset = parseInt(searchParams.get('offset')) || 0;
        const category = searchParams.get('category');

        let query = 'SELECT * FROM furniture_catalog';
        const values = [];
        let paramCount = 1;

        // Filter by category if provided
        if (category) {
            query += ` WHERE category = $${paramCount}`;
            values.push(category);
            paramCount++;
        }

        // Add ordering and pagination
        query += ` ORDER BY name ASC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
        values.push(limit, offset);

        const result = await pool.query(query, values);

        // Get total count
        let countQuery = 'SELECT COUNT(*) FROM furniture_catalog';
        const countValues = [];
        if (category) {
            countQuery += ' WHERE category = $1';
            countValues.push(category);
        }
        const countResult = await pool.query(countQuery, countValues);
        const total = parseInt(countResult.rows[0].count);

        return NextResponse.json({
            furniture: result.rows,
            pagination: {
                total,
                limit,
                offset,
                hasMore: offset + limit < total
            }
        });

    } catch (error) {
        console.error('Furniture GET Error:', error);
        return NextResponse.json(
            { error: 'Failed to get furniture', details: error.message },
            { status: 500 }
        );
    }
}