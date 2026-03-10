import { NextResponse } from 'next/server';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

/**
 * GET room settings for a project
 * GET /api/projects/:projectId/room-settings
 */
export async function GET(request, { params }) {
    try {
        const { projectId } = params;

        // Get design state
        const query = await pool.query(
            'SELECT room_config FROM design_states WHERE project_id = $1',
            [projectId]
        );

        if (query.rows.length === 0) {
            return NextResponse.json(
                { error: 'Design state not found' },
                { status: 404 }
            );
        }

        const roomConfig = query.rows[0].room_config || {};

        return NextResponse.json({
            wallColor: roomConfig.wallColor || '#FFFFFF',
            floorColor: roomConfig.floorColor || 'White',
            width: roomConfig.width || 450,
            height: roomConfig.height || 320,
            ceilingHeight: roomConfig.ceilingHeight || 240,
        });

    } catch (error) {
        console.error('Room Settings GET Error:', error);
        return NextResponse.json(
            { error: 'Failed to get room settings', details: error.message },
            { status: 500 }
        );
    }
}

/**
 * UPDATE room settings for a project
 * PUT /api/projects/:projectId/room-settings
 * Body: { wallColor?, floorColor?, width?, height?, ceilingHeight? }
 */
export async function PUT(request, { params }) {
    try {
        const { projectId } = params;
        const body = await request.json();
        const { wallColor, floorColor, width, height, ceilingHeight } = body;

        // Validate inputs
        if (width && (width < 100 || width > 2000)) {
            return NextResponse.json(
                { error: 'Width must be between 100 and 2000 cm' },
                { status: 400 }
            );
        }

        if (height && (height < 100 || height > 2000)) {
            return NextResponse.json(
                { error: 'Height must be between 100 and 2000 cm' },
                { status: 400 }
            );
        }

        if (ceilingHeight && (ceilingHeight < 200 || ceilingHeight > 500)) {
            return NextResponse.json(
                { error: 'Ceiling height must be between 200 and 500 cm' },
                { status: 400 }
            );
        }

        // Check if design state exists
        const checkQuery = await pool.query(
            'SELECT room_config FROM design_states WHERE project_id = $1',
            [projectId]
        );

        if (checkQuery.rows.length === 0) {
            return NextResponse.json(
                { error: 'Design state not found' },
                { status: 404 }
            );
        }

        const currentConfig = checkQuery.rows[0].room_config || {};

        // Merge new settings with existing config
        const updatedConfig = {
            ...currentConfig,
            ...(wallColor && { wallColor }),
            ...(floorColor && { floorColor }),
            ...(width && { width }),
            ...(height && { height }),
            ...(ceilingHeight && { ceilingHeight }),
        };

        // Update design state
        const updateQuery = await pool.query(
            `UPDATE design_states 
       SET room_config = $1, updated_at = NOW() 
       WHERE project_id = $2 
       RETURNING room_config`,
            [JSON.stringify(updatedConfig), projectId]
        );

        // Also update project's updated_at
        await pool.query(
            'UPDATE projects SET updated_at = NOW() WHERE id = $1',
            [projectId]
        );

        return NextResponse.json({
            success: true,
            roomConfig: updateQuery.rows[0].room_config
        });

    } catch (error) {
        console.error('Room Settings PUT Error:', error);
        return NextResponse.json(
            { error: 'Failed to update room settings', details: error.message },
            { status: 500 }
        );
    }
}