import { NextResponse } from 'next/server';
import pkg from 'pg';
import { verifyToken } from '@/lib/middleware/auth';

const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

/**
 * GET all projects for user
 * GET /api/projects
 */
export async function GET(request) {
    try {
        const auth = verifyToken(request);
        if (auth.error) {
            return NextResponse.json(
                { error: auth.error },
                { status: auth.status }
            );
        }

        const userId = auth.userId;

        const result = await pool.query(
            `SELECT id, name, thumbnail_url, created_at, updated_at
       FROM projects
       WHERE user_id = $1
       ORDER BY updated_at DESC`,
            [userId]
        );

        return NextResponse.json({
            projects: result.rows
        });

    } catch (error) {
        console.error('Get Projects Error:', error);
        return NextResponse.json(
            { error: 'Failed to get projects', details: error.message },
            { status: 500 }
        );
    }
}

/**
 * CREATE new project
 * POST /api/projects
 * Body: { name }
 */
export async function POST(request) {
    try {
        const auth = verifyToken(request);
        if (auth.error) {
            return NextResponse.json(
                { error: auth.error },
                { status: auth.status }
            );
        }

        const userId = auth.userId;
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

        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const projectResult = await client.query(
                `INSERT INTO projects (user_id, name)
         VALUES ($1, $2)
         RETURNING id, name, thumbnail_url, created_at, updated_at`,
                [userId, name.trim()]
            );

            const project = projectResult.rows[0];

            await client.query(
                `INSERT INTO design_states (project_id, room_config, furniture_items)
         VALUES ($1, $2, $3)`,
                [
                    project.id,
                    JSON.stringify({ width: 450, height: 320, ceilingHeight: 240, wallColor: '#FFFFFF', floorColor: '#F0F0F0' }),
                    JSON.stringify([])
                ]
            );

            await client.query('COMMIT');

            return NextResponse.json({
                success: true,
                project
            }, { status: 201 });

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }

    } catch (error) {
        console.error('Create Project Error:', error);
        return NextResponse.json(
            { error: 'Failed to create project', details: error.message },
            { status: 500 }
        );
    }
}