import { NextResponse } from 'next/server';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

/**
 * CREATE project from template
 * POST /api/projects/from-template
 * Body: { templateId, userId, projectName? }
 */
export async function POST(request) {
    try {
        const body = await request.json();
        const { templateId, userId, projectName } = body;

        if (!templateId) {
            return NextResponse.json(
                { error: 'Template ID is required' },
                { status: 400 }
            );
        }

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Get template
        const template = await pool.query(
            'SELECT * FROM templates WHERE id = $1',
            [templateId]
        );

        if (template.rows.length === 0) {
            return NextResponse.json(
                { error: 'Template not found' },
                { status: 404 }
            );
        }

        const templateData = template.rows[0];

        // Use provided name or template name
        const name = projectName || templateData.name;

        // Create new project
        const newProject = await pool.query(
            `INSERT INTO projects (user_id, name, thumbnail_url)
       VALUES ($1, $2, $3)
       RETURNING *`,
            [userId, name, templateData.thumbnail_url]
        );

        const projectId = newProject.rows[0].id;

        // Create design state from template
        await pool.query(
            `INSERT INTO design_states (project_id, furniture_items, room_config)
       VALUES ($1, $2, $3)`,
            [
                projectId,
                JSON.stringify(templateData.furniture_items),
                JSON.stringify(templateData.room_config)
            ]
        );

        return NextResponse.json({
            success: true,
            project: newProject.rows[0]
        }, { status: 201 });

    } catch (error) {
        console.error('Create from Template Error:', error);
        return NextResponse.json(
            { error: 'Failed to create project from template', details: error.message },
            { status: 500 }
        );
    }
}