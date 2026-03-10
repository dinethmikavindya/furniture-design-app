import { NextResponse } from 'next/server';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

/**
 * SAVE AS - Duplicate project with new name
 * POST /api/projects/:projectId/save-as
 * Body: { name, userId }
 */
export async function POST(request, { params }) {
    try {
        const { projectId } = params;
        const body = await request.json();
        const { name, userId } = body;

        if (!name || name.trim() === '') {
            return NextResponse.json(
                { error: 'Project name is required' },
                { status: 400 }
            );
        }

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        if (name.length > 100) {
            return NextResponse.json(
                { error: 'Project name must be 100 characters or less' },
                { status: 400 }
            );
        }

        // Get original project
        const originalProject = await pool.query(
            'SELECT * FROM projects WHERE id = $1',
            [projectId]
        );

        if (originalProject.rows.length === 0) {
            return NextResponse.json(
                { error: 'Original project not found' },
                { status: 404 }
            );
        }

        // Get original design state
        const originalDesign = await pool.query(
            'SELECT * FROM design_states WHERE project_id = $1',
            [projectId]
        );

        // Create new project
        const newProject = await pool.query(
            `INSERT INTO projects (user_id, name, thumbnail_url)
       VALUES ($1, $2, $3)
       RETURNING *`,
            [userId, name.trim(), originalProject.rows[0].thumbnail_url]
        );

        const newProjectId = newProject.rows[0].id;

        // Copy design state if exists
        if (originalDesign.rows.length > 0) {
            await pool.query(
                `INSERT INTO design_states (project_id, furniture_items, room_config)
   VALUES ($1, $2, $3)`,
                [
                    newProjectId,
                    JSON.stringify(originalDesign.rows[0].furniture_items),
                    JSON.stringify(originalDesign.rows[0].room_config)
                ]
            );
        }

        return NextResponse.json({
            success: true,
            project: newProject.rows[0]
        }, { status: 201 });

    } catch (error) {
        console.error('Save As Error:', error);
        return NextResponse.json(
            { error: 'Failed to duplicate project', details: error.message },
            { status: 500 }
        );
    }
}