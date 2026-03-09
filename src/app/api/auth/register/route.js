import { NextResponse } from 'next/server';
import pkg from 'pg';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/middleware/auth';

const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

/**
 * REGISTER new user
 * POST /api/auth/register
 * Body: { email, password, name }
 */
export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password, name } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        console.log(`Registration attempt for email: ${email}`);
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email.toLowerCase()]
        );

        console.log(`Existing user count for ${email.toLowerCase()}: ${existingUser.rows.length}`);

        if (existingUser.rows.length > 0) {
            console.log(`Conflict: Email ${email.toLowerCase()} is already in database.`);
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 409 }
            );
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
            `INSERT INTO users (email, password_hash, name, theme, preferences)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, email, name, theme, preferences`,
            [
                email.toLowerCase(),
                passwordHash,
                name || null,
                'light',
                JSON.stringify({
                    gridEnabled: true,
                    gridSize: 20,
                    snapToGrid: false,
                    measurementSystem: 'metric',
                    ceilingHeight: 240
                })
            ]
        );

        const user = newUser.rows[0];
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
        }, { status: 201 });

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
        console.error('Register Error:', error);
        return NextResponse.json(
            { error: 'Registration failed', details: error.message },
            { status: 500 }
        );
    }
}