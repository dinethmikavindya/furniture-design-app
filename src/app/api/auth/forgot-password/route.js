import { NextResponse } from 'next/server';
import pkg from 'pg';
import crypto from 'crypto';

const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

/**
 * FORGOT PASSWORD
 * POST /api/auth/forgot-password
 * Body: { email }
 */
export async function POST(request) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        const user = await pool.query(
            'SELECT id, email FROM users WHERE email = $1',
            [email.toLowerCase()]
        );

        if (user.rows.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'If an account exists with this email, a password reset link has been sent'
            });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000);

        await pool.query(
            'UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE id = $3',
            [resetToken, resetTokenExpiry, user.rows[0].id]
        );

        return NextResponse.json({
            success: true,
            message: 'If an account exists with this email, a password reset link has been sent',
            resetToken: resetToken,
            resetLink: `http://localhost:3000/reset-password?token=${resetToken}`
        });

    } catch (error) {
        console.error('Forgot Password Error:', error);
        return NextResponse.json(
            { error: 'Failed to process request', details: error.message },
            { status: 500 }
        );
    }
}