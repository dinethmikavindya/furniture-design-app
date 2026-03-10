import { NextResponse } from 'next/server';
import pkg from 'pg';
import bcrypt from 'bcryptjs';

const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

/**
 * RESET PASSWORD
 * POST /api/auth/reset-password
 * Body: { token, newPassword }
 */
export async function POST(request) {
    try {
        const body = await request.json();
        const { token, newPassword } = body;

        if (!token) {
            return NextResponse.json(
                { error: 'Reset token is required' },
                { status: 400 }
            );
        }

        if (!newPassword || newPassword.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        // Find user with valid (non-expired) reset token
        const result = await pool.query(
            'SELECT id, email FROM users WHERE reset_token = $1 AND reset_token_expiry > NOW()',
            [token]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Invalid or expired reset token' },
                { status: 400 }
            );
        }

        const user = result.rows[0];

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);

        // Update password and clear reset token
        await pool.query(
            `UPDATE users 
             SET password_hash = $1, reset_token = NULL, reset_token_expiry = NULL, updated_at = NOW()
             WHERE id = $2`,
            [passwordHash, user.id]
        );

        return NextResponse.json({
            success: true,
            message: 'Password has been reset successfully. You can now log in with your new password.'
        });

    } catch (error) {
        console.error('Reset Password Error:', error);
        return NextResponse.json(
            { error: 'Failed to reset password', details: error.message },
            { status: 500 }
        );
    }
}
