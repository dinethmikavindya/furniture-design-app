import { NextResponse } from 'next/server';
import pkg from 'pg';
import { verifyToken } from '@/lib/middleware/auth';

const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

/**
 * GET current user info
 * GET /api/auth/me
 * Requires: Authorization header with Bearer token
 */
export async function GET(request) {
    try {
        const auth = verifyToken(request);
        if (auth.error) {
            return NextResponse.json(
                { error: auth.error },
                { status: auth.status }
            );
        }

        const result = await pool.query(
            'SELECT id, email, name, theme, preferences, created_at FROM users WHERE id = $1',
            [auth.userId]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const user = result.rows[0];

        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                theme: user.theme,
                preferences: user.preferences,
                createdAt: user.created_at,
            }
        });

    } catch (error) {
        console.error('Auth Me Error:', error);
        return NextResponse.json(
            { error: 'Failed to get user info', details: error.message },
            { status: 500 }
        );
    }
}
