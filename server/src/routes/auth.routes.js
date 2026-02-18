// Authentication routes - register and login
const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { hashPassword, comparePassword, generateToken } = require('../middleware/auth');

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

module.exports = router;