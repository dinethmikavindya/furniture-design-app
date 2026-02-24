import { NextResponse } from 'next/server';

/**
 * LOGOUT user
 * POST /api/auth/logout
 */
export async function POST(request) {
    try {
        return NextResponse.json({
            success: true,
            message: 'Logged out successfully'
        });

    } catch (error) {
        console.error('Logout Error:', error);
        return NextResponse.json(
            { error: 'Logout failed', details: error.message },
            { status: 500 }
        );
    }
}