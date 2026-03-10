import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Verify JWT token from Authorization header or cookie
 */
export function verifyToken(request) {
    try {
        let token = request.headers.get('authorization')?.replace('Bearer ', '');

        if (!token) {
            const cookieHeader = request.headers.get('cookie');
            if (cookieHeader) {
                const cookies = Object.fromEntries(
                    cookieHeader.split('; ').map(c => {
                        const [key, ...v] = c.split('=');
                        return [key, v.join('=')];
                    })
                );
                token = cookies.token || cookies.auth_token;
            }
        }

        if (!token) {
            return { error: 'No token provided', status: 401 };
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        return { userId: decoded.userId, user: decoded };

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return { error: 'Token expired', status: 401 };
        }
        if (error.name === 'JsonWebTokenError') {
            return { error: 'Invalid token', status: 401 };
        }
        return { error: 'Authentication failed', status: 401 };
    }
}

/**
 * Generate JWT token for user
 */
export function generateToken(userId, email) {
    return jwt.sign(
        { userId, email },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
}