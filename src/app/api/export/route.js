import { NextResponse } from 'next/server';
import pkg from 'pg';
const { Pool } = pkg;

// FIXME: The 'canvas' library causes build failures on environments 
// missing node-gyp build tools (like macOS without xcode headers).
// import { createCanvas } from 'canvas';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

/**
 * Export design as image (PNG or JPG)
 * GET /api/export?projectId={id}&format={png|jpg}
 */
export async function GET(request) {
    return NextResponse.json(
        { error: 'Export functionality is temporarily disabled due to server environment constraints.', },
        { status: 501 }
    );
}