import { NextResponse } from 'next/server';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

/**
 * GET user settings
 * GET /api/settings?userId={id}
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID required' },
                { status: 400 }
            );
        }

        const query = await pool.query(
            'SELECT theme, preferences FROM users WHERE id = $1',
            [userId]
        );

        if (query.rows.length === 0) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const user = query.rows[0];

        return NextResponse.json({
            theme: user.theme || 'light',
            preferences: user.preferences || {
                gridEnabled: true,
                gridSize: 20
            }
        });

    } catch (error) {
        console.error('Settings GET Error:', error);
        return NextResponse.json(
            { error: 'Failed to get settings', details: error.message },
            { status: 500 }
        );
    }
}

/**
 * UPDATE user settings
 * PUT /api/settings
 * Body: { userId, theme?, preferences? }
 */
export async function PUT(request) {
    try {
        const body = await request.json();
        const { userId, theme, preferences } = body;

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID required' },
                { status: 400 }
            );
        }

        const updates = [];
        const values = [];
        let paramCount = 1;

        if (theme) {
            updates.push(`theme = $${paramCount}`);
            values.push(theme);
            paramCount++;
        }

        if (preferences) {
            updates.push(`preferences = $${paramCount}`);
            values.push(JSON.stringify(preferences));
            paramCount++;
        }

        if (updates.length === 0) {
            return NextResponse.json(
                { error: 'No settings to update' },
                { status: 400 }
            );
        }

        values.push(userId);

        const query = `
      UPDATE users 
      SET ${updates.join(', ')}, updated_at = NOW()
      WHERE id = $${paramCount}
      RETURNING theme, preferences
    `;

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            theme: result.rows[0].theme,
            preferences: result.rows[0].preferences
        });

    } catch (error) {
        console.error('Settings PUT Error:', error);
        return NextResponse.json(
            { error: 'Failed to update settings', details: error.message },
            { status: 500 }
        );
    }
}