// Authentication routes - register and login
const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { hashPassword, comparePassword, generateToken } = require('../middleware/auth');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// POST /api/auth/register - Register new user
router.post('/register', async (req, res) => {
    try {
        // Get data from request body
        const { email, password, name } = req.body;

        // Validation - check all fields provided
        if (!email || !password || !name) {
            return res.status(400).json({
                error: 'Email, password, and name are required'
            });
        }

        // Validate email format (simple check)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                error: 'Password must be at least 6 characters'
            });
        }

        // Check if email already exists
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        // Hash the password for security
        const hashedPassword = await hashPassword(password);

        // Insert new user into database
        const result = await pool.query(
            `INSERT INTO users (email, password_hash, name) 
       VALUES ($1, $2, $3) 
       RETURNING id, email, name, created_at`,
            [email, hashedPassword, name]
        );

        // Get the created user
        const user = result.rows[0];

        // Generate JWT token for automatic login
        const token = generateToken(user.id);

        // Send response - DON'T send password hash!
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                createdAt: user.created_at
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// POST /api/auth/login - Login user
router.post('/login', async (req, res) => {
    try {
        // Get credentials from request
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                error: 'Email and password are required'
            });
        }

        // Find user by email
        const result = await pool.query(
            'SELECT id, email, name, password_hash, created_at FROM users WHERE email = $1',
            [email]
        );

        // Check if user exists
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = result.rows[0];

        // Compare provided password with stored hash
        const isValidPassword = await comparePassword(password, user.password_hash);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = generateToken(user.id);

        // Send response - DON'T send password hash!
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                createdAt: user.created_at
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// GET /api/auth/me - Get current user info (protected route)
router.get('/me', require('../middleware/auth').authenticateToken, async (req, res) => {
    try {
        // req.user comes from authenticateToken middleware
        const userId = req.user.userId;

        // Get user from database
        const result = await pool.query(
            'SELECT id, email, name, created_at FROM users WHERE id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user: result.rows[0] });

    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to get user info' });
    }
});

// POST /api/auth/forgot-password - Request password reset
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Check if user exists
        const result = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            // Don't reveal if email exists or not for security
            return res.json({ message: 'If the email exists, a reset link has been sent' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour

        // Store reset token
        await pool.query(
            'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3',
            [resetToken, resetTokenExpires, email]
        );

        // Try to send email if SMTP config is available
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const resetLink = `${frontendUrl}/(auth)/reset-password?token=${resetToken}`;

        if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
            try {
                const transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST,
                    port: parseInt(process.env.SMTP_PORT || '587', 10),
                    secure: process.env.SMTP_SECURE === 'true',
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS,
                    },
                });

                const mailOptions = {
                    from: process.env.FROM_EMAIL || process.env.SMTP_USER,
                    to: email,
                    subject: 'Password reset request',
                    text: `You requested a password reset. Use the link below to reset your password (valid 1 hour):\n\n${resetLink}`,
                    html: `<p>You requested a password reset. Click the link below to reset your password (valid 1 hour):</p><p><a href="${resetLink}">${resetLink}</a></p>`,
                };

                await transporter.sendMail(mailOptions);
                console.log(`Password reset email sent to ${email}`);

                res.json({ message: 'If the email exists, a reset link has been sent' });
            } catch (mailErr) {
                console.error('Failed to send reset email:', mailErr);
                // Fallback to returning the token for testing
                console.log(`Reset token for ${email}: ${resetToken}`);
                res.json({ message: 'If the email exists, a reset link has been sent', resetToken });
            }
        } else {
            // No SMTP configured - log token and return it for testing
            console.log(`Reset token for ${email}: ${resetToken}`);
            res.json({ 
                message: 'If the email exists, a reset link has been sent',
                resetToken: resetToken
            });
        }

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Failed to process request' });
    }
});

// POST /api/auth/reset-password - Reset password with token
router.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ error: 'Token and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Find user with valid reset token
        const result = await pool.query(
            'SELECT id FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()',
            [token]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid or expired reset token' });
        }

        const userId = result.rows[0].id;

        // Hash new password
        const hashedPassword = await hashPassword(newPassword);

        // Update password and clear reset token
        await pool.query(
            'UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2',
            [hashedPassword, userId]
        );

        res.json({ message: 'Password reset successfully' });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Failed to reset password' });
    }
});

module.exports = router;