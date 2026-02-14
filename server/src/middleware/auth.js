// Authentication middleware and helpers
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Secret key for JWT (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Hash password before saving to database
async function hashPassword(password) {
    // Salt rounds = 10 means hash the password 2^10 times (very secure)
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

// Compare login password with hashed password in database
async function comparePassword(password, hashedPassword) {
    // Returns true if passwords match, false otherwise
    return await bcrypt.compare(password, hashedPassword);
}

// Generate JWT token after successful login
function generateToken(userId) {
    // Create token with user ID that expires in 7 days
    return jwt.sign(
        { userId },              // Payload - data stored in token
        JWT_SECRET,              // Secret key to sign token
        { expiresIn: '7d' }      // Token expires in 7 days
    );
}

// Middleware to verify JWT token on protected routes
function authenticateToken(req, res, next) {
    // Get token from Authorization header
    // Format: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Get part after "Bearer "

    // If no token provided
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    // Verify token is valid
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            // Token is invalid or expired
            return res.status(403).json({ error: 'Invalid or expired token' });
        }

        // Token is valid - attach user info to request
        // Now other functions can access req.user
        req.user = decoded;
        next(); // Continue to the actual route handler
    });
}

// Export all functions
module.exports = {
    hashPassword,
    comparePassword,
    generateToken,
    authenticateToken
};