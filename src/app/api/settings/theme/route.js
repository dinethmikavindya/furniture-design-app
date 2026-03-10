import { NextResponse } from 'next/server';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

/**
 * Update user theme (light/dark)
 * POST /api/settings/theme
 * Body: { userId, theme }
 */
export async function POST(request) {
    try {
        const body = await request.json();
        const { userId, theme } = body;

        if (!userId || !theme) {
            return NextResponse.json(
                { error: 'User ID and theme required' },
                { status: 400 }
            );
        }

        if (!['light', 'dark'].includes(theme)) {
            return NextResponse.json(
                { error: 'Theme must be "light" or "dark"' },
                { status: 400 }
            );
        }

        const query = await pool.query(
            'UPDATE users SET theme = $1, updated_at = NOW() WHERE id = $2 RETURNING theme',
            [theme, userId]
        );

        if (query.rows.length === 0) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            theme: query.rows[0].theme
        });

    } catch (error) {
        console.error('Theme API Error:', error);
        return NextResponse.json(
            { error: 'Failed to update theme', details: error.message },
            { status: 500 }
        );
    }
}