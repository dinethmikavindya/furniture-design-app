# Authentication & Analytics Setup Guide

This document provides step-by-step instructions for setting up and testing the authentication and analytics features.

## Database Setup

### 1. Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE furniture_db;

# Create user
CREATE USER dinithiwijesinghe WITH PASSWORD 'your_secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE furniture_db TO dinithiwijesinghe;

# Exit psql
\q
```

### 2. Initialize Schema

```bash
cd server
psql -U dinithiwijesinghe -d furniture_db -f database/schema.sql
psql -U dinithiwijesinghe -d furniture_db -f database/add-reset-tokens.sql
```

## Server Setup

### 1. Environment Variables

Create `server/.env`:

```env
# Database
DATABASE_URL=postgresql://dinithiwijesinghe:your_secure_password@localhost:5432/furniture_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# Frontend URL (used for password reset links)
FRONTEND_URL=http://localhost:3000

# SMTP Configuration (optional)
# If not set, reset tokens will be logged and returned in API responses
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_SECURE=false
FROM_EMAIL=no-reply@yourapp.com
```

### 2. Install Dependencies

```bash
cd server
npm install
```

### 3. Start Server

```bash
npm start
# Server runs on http://localhost:3001
```

## Frontend Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
# Frontend runs on http://localhost:3000
```

## Testing Authentication Flow

### Manual Testing via Web UI

1. **Sign Up:**
   - Visit http://localhost:3000/signup
   - Fill in name, email, password
   - Click "Sign Up"
   - You'll be redirected to dashboard if successful

2. **Login:**
   - Visit http://localhost:3000/login
   - Enter email and password
   - Click "Login"

3. **Password Reset:**
   - Click "Forgot your password?" on login page
   - Enter your email on the forgot-password page
   - Check server logs for the reset token (if SMTP not configured)
   - Visit `http://localhost:3000/(auth)/reset-password?token=YOUR_TOKEN_HERE`
   - Enter new password and confirm
   - Click "Reset Password"

### API Testing with cURL

#### Register User

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2026-02-22T00:00:00.000Z"
  }
}
```

#### Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

#### Request Password Reset

```bash
curl -X POST http://localhost:3001/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

**Response (without SMTP):**
```json
{
  "message": "If the email exists, a reset link has been sent",
  "resetToken": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
}
```

#### Reset Password

```bash
curl -X POST http://localhost:3001/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
    "newPassword": "newpassword456"
  }'
```

#### Get Current User

```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Testing Analytics

### 1. Create a User

Use the signup/login flow above and get a JWT token.

### 2. Create Some Projects (Optional)

Analytics will show data for existing projects. Create projects via your project API.

### 3. View Analytics Widget

- Log in via http://localhost:3000/login
- Go to http://localhost:3000/dashboard
- The analytics widget should display:
  - Total projects
  - Projects this week/month
  - Total furniture items
  - Most used furniture types
  - Recent projects

### 4. API Test

```bash
curl "http://localhost:3001/api/analytics?userId=YOUR_USER_ID"
```

## Email Configuration (Optional)

### Using Gmail

1. Enable 2-factor authentication on your Google account
2. Generate an app password: https://myaccount.google.com/apppasswords
3. Set in `.env`:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_SECURE=false
   ```

### Using Ethereal (Testing)

For development testing without a real email service:

1. Visit https://ethereal.email/create
2. Create a test account
3. Use the provided credentials in `.env`
4. Password reset emails will be logged at https://ethereal.email/messages

## Troubleshooting

### Database Connection Failed
- Ensure PostgreSQL is running
- Check username/password in `DATABASE_URL`
- Verify database exists: `psql -U dinithiwijesinghe -l`

### Reset Token Not Returned
- Check SMTP configuration — if SMTP is properly configured, token won't be returned
- Check server logs for email sending status
- For testing without email, ensure SMTP env vars are NOT set

### Frontend Can't Connect to Backend
- Ensure backend is running on http://localhost:3001
- Check CORS is enabled (it is in the server config)
- Check firewall/network connectivity

### JWT Token Invalid
- Ensure `JWT_SECRET` is the same on both server and client
- Check token expiration (7 days)
- Try logging in again to get a fresh token

## Production Deployment

Before deploying to production:

1. Set strong, random values for `JWT_SECRET`
2. Configure proper SMTP service (Gmail, SendGrid, etc.)
3. Use environment-specific `.env` files
4. Enable HTTPS (set `SMTP_SECURE=true` for production SMTP)
5. Change default database credentials
6. Set appropriate `FRONTEND_URL`
7. Run `npm run build` to test production build

## Security Notes

- Passwords are hashed using bcrypt (salt rounds: 10)
- Tokens expire in 7 days
- Reset tokens expire in 1 hour
- Reset tokens are single-use (invalidated after use)
- Email addresses are case-insensitively stored
