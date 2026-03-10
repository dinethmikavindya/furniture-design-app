import { NextResponse } from 'next/server';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

/**
 * GET single furniture item by ID
 * GET /api/furniture/:id
 */
export async function GET(request, { params }) {
    try {
        const { furnitureId } = params;

        const query = await pool.query(
            'SELECT * FROM furniture_catalog WHERE id = $1',
            [furnitureId]
        );

        if (query.rows.length === 0) {
            return NextResponse.json(
                { error: 'Furniture not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(query.rows[0]);

    } catch (error) {
        console.error('Furniture Detail Error:', error);
        return NextResponse.json(
            { error: 'Failed to get furniture details', details: error.message },
            { status: 500 }
        );
    }
}