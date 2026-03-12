import { NextResponse } from 'next/server';
import pkg from 'pg';
import { verifyToken } from '@/lib/middleware/auth';

const { Pool } = pkg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function POST(request) {
    try {
        const auth = verifyToken(request);
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
        const userId = auth.userId;

        const body = await request.json();
        const { templateId, projectName } = body;

        if (!templateId) return NextResponse.json({ error: 'Template ID is required' }, { status: 400 });

        const template = await pool.query('SELECT * FROM templates WHERE id = $1', [templateId]);
        if (template.rows.length === 0) return NextResponse.json({ error: 'Template not found' }, { status: 404 });

        const templateData = template.rows[0];
        const name = projectName || templateData.name;

        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const newProject = await client.query(
                `INSERT INTO projects (user_id, name) VALUES ($1, $2) RETURNING *`,
                [userId, name]
            );
            const projectId = newProject.rows[0].id;
            await client.query(
                `INSERT INTO design_states (project_id, furniture_items, room_config) VALUES ($1, $2, $3)`,
                [projectId, JSON.stringify(templateData.furniture_items), JSON.stringify(templateData.room_config)]
            );
            await client.query('COMMIT');
            return NextResponse.json({ success: true, project: newProject.rows[0] }, { status: 201 });
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Create from Template Error:', error);
        return NextResponse.json({ error: 'Failed to create project from template', details: error.message }, { status: 500 });
    }
}
