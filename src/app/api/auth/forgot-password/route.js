import { NextResponse } from 'next/server';
import pkg from 'pg';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Create reusable email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
});

/**
 * Build the password reset email HTML
 */
function buildResetEmail(resetLink) {
    return `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 24px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="font-size: 24px; font-weight: 700; color: #2d1f4e; margin: 0;">
          Mauve Studio<span style="color: #8b5cf6;">.</span>
        </h1>
      </div>

      <div style="background: #f9f7ff; border-radius: 16px; padding: 32px 24px; border: 1px solid #ede9fe;">
        <h2 style="font-size: 20px; font-weight: 600; color: #2d1f4e; margin: 0 0 12px;">
          Reset Your Password
        </h2>
        <p style="font-size: 14px; color: #6b7280; line-height: 1.6; margin: 0 0 24px;">
          We received a request to reset your password. Click the button below to choose a new password. 
          This link expires in <strong>1 hour</strong>.
        </p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${resetLink}" 
             style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #8b5cf6, #6d28d9); 
                    color: #fff; text-decoration: none; border-radius: 50px; font-size: 15px; font-weight: 600;
                    box-shadow: 0 4px 16px rgba(109, 40, 217, 0.3);">
            Reset Password
          </a>
        </div>
        <p style="font-size: 12px; color: #9ca3af; line-height: 1.5; margin: 0;">
          If you didn't request this, you can safely ignore this email. Your password won't be changed.
        </p>
      </div>

      <div style="text-align: center; margin-top: 24px;">
        <p style="font-size: 11px; color: #c4b5fd;">
          © Mauve Studio — Furniture Design App
        </p>
      </div>
    </div>
    `;
}

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

        // Always return the same message whether user exists or not (security)
        const successMessage = 'If an account exists with this email, a password reset link has been sent';

        const user = await pool.query(
            'SELECT id, email FROM users WHERE email = $1',
            [email.toLowerCase()]
        );

        if (user.rows.length === 0) {
            // Don't reveal whether the email exists
            return NextResponse.json({
                success: true,
                message: successMessage
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        // Save token to database
        await pool.query(
            'UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE id = $3',
            [resetToken, resetTokenExpiry, user.rows[0].id]
        );

        // Build reset link
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;

        // Send email
        try {
            await transporter.sendMail({
                from: `"Mauve Studio" <${process.env.EMAIL_USER}>`,
                to: user.rows[0].email,
                subject: 'Reset Your Password — Mauve Studio',
                html: buildResetEmail(resetLink),
            });
        } catch (emailError) {
            console.error('Email send error:', emailError);
            // Don't expose email sending failure to the client for security
            // But log it server-side for debugging
        }

        return NextResponse.json({
            success: true,
            message: successMessage
        });

    } catch (error) {
        console.error('Forgot Password Error:', error);
        return NextResponse.json(
            { error: 'Failed to process request', details: error.message },
            { status: 500 }
        );
    }
}