import { NextResponse } from 'next/server';
import pkg from 'pg';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/middleware/auth';

const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

/**
 * LOGIN user
 * POST /api/auth/login
 * Body: { email, password }
 */
export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        const query = await pool.query(
            'SELECT id, email, name, password_hash, theme, preferences FROM users WHERE email = $1',
            [email.toLowerCase()]
        );

        if (query.rows.length === 0) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        const user = query.rows[0];

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        const token = generateToken(user.id, user.email);

        const response = NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                theme: user.theme,
                preferences: user.preferences
            }
        });

        // Set HttpOnly Cookie
        response.cookies.set({
            name: 'auth_token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 // 7 days
        });

        return response;

    } catch (error) {
        console.error('Login Error:', error);
        return NextResponse.json(
            { error: 'Login failed', details: error.message },
            { status: 500 }
        );
    }
}