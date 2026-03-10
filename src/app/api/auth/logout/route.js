import { NextResponse } from 'next/server';

/**
 * LOGOUT user
 * POST /api/auth/logout
 */
export async function POST(request) {
    try {
        const response = NextResponse.json({
            success: true,
            message: 'Logged out successfully'
        });

        // Clear the auth_token cookie
        response.cookies.set({
            name: 'auth_token',
            value: '',
            httpOnly: true,
            expires: new Date(0),
            path: '/'
        });

        return response;

    } catch (error) {
        console.error('Logout Error:', error);
        return NextResponse.json(
            { error: 'Logout failed', details: error.message },
            { status: 500 }
        );
    }
}