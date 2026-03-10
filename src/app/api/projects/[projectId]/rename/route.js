import { NextResponse } from 'next/server';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

/**
 * RENAME project
 * PUT /api/projects/:projectId/rename
 * Body: { name }
 */
export async function PUT(request, { params }) {
    try {
        const { projectId } = params;
        const body = await request.json();
        const { name } = body;

        if (!name || name.trim() === '') {
            return NextResponse.json(
                { error: 'Project name is required' },
                { status: 400 }
            );
        }

        if (name.length > 100) {
            return NextResponse.json(
                { error: 'Project name must be 100 characters or less' },
                { status: 400 }
            );
        }

        // Update project name
        const query = await pool.query(
            `UPDATE projects 
       SET name = $1, updated_at = NOW() 
       WHERE id = $2 
       RETURNING *`,
            [name.trim(), projectId]
        );

        if (query.rows.length === 0) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            project: query.rows[0]
        });

    } catch (error) {
        console.error('Project Rename Error:', error);
        return NextResponse.json(
            { error: 'Failed to rename project', details: error.message },
            { status: 500 }
        );
    }
}