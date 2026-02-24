import { NextResponse } from 'next/server';
import pkg from 'pg';
import { verifyToken } from '@/lib/middleware/auth';

const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

/**
 * GET single project with design state
 * GET /api/projects/:projectId
 */
export async function GET(request, { params }) {
    try {
        const auth = verifyToken(request);
        if (auth.error) {
            return NextResponse.json(
                { error: auth.error },
                { status: auth.status }
            );
        }

        const userId = auth.userId;
        const { projectId } = params;

        const result = await pool.query(
            `SELECT 
        p.id, p.name, p.thumbnail_url, p.created_at, p.updated_at,
        d.room_config, d.furniture_items
       FROM projects p
       LEFT JOIN design_states d ON p.id = d.project_id
       WHERE p.id = $1 AND p.user_id = $2`,
            [projectId, userId]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            project: result.rows[0]
        });

    } catch (error) {
        console.error('Get Project Error:', error);
        return NextResponse.json(
            { error: 'Failed to get project', details: error.message },
            { status: 500 }
        );
    }
}

/**
 * UPDATE project
 * PUT /api/projects/:projectId
 * Body: { name?, roomConfig?, furnitureItems? }
 */
export async function PUT(request, { params }) {
    try {
        const auth = verifyToken(request);
        if (auth.error) {
            return NextResponse.json(
                { error: auth.error },
                { status: auth.status }
            );
        }

        const userId = auth.userId;
        const { projectId } = params;
        const body = await request.json();
        const { name, roomConfig, furnitureItems } = body;

        const checkResult = await pool.query(
            'SELECT id FROM projects WHERE id = $1 AND user_id = $2',
            [projectId, userId]
        );

        if (checkResult.rows.length === 0) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            if (name) {
                if (name.length > 100) {
                    return NextResponse.json(
                        { error: 'Project name must be 100 characters or less' },
                        { status: 400 }
                    );
                }

                await client.query(
                    'UPDATE projects SET name = $1, updated_at = NOW() WHERE id = $2',
                    [name.trim(), projectId]
                );
            }

            if (roomConfig || furnitureItems) {
                const updates = [];
                const values = [];
                let paramCount = 1;

                if (roomConfig) {
                    updates.push(`room_config = $${paramCount}`);
                    values.push(JSON.stringify(roomConfig));
                    paramCount++;
                }

                if (furnitureItems) {
                    updates.push(`furniture_items = $${paramCount}`);
                    values.push(JSON.stringify(furnitureItems));
                    paramCount++;
                }

                updates.push('updated_at = NOW()');
                values.push(projectId);

                await client.query(
                    `UPDATE design_states
           SET ${updates.join(', ')}
           WHERE project_id = $${paramCount}`,
                    values
                );

                await client.query(
                    'UPDATE projects SET updated_at = NOW() WHERE id = $1',
                    [projectId]
                );
            }

            await client.query('COMMIT');

            const result = await pool.query(
                `SELECT 
          p.id, p.name, p.thumbnail_url, p.created_at, p.updated_at,
          d.room_config, d.furniture_items
         FROM projects p
         LEFT JOIN design_states d ON p.id = d.project_id
         WHERE p.id = $1`,
                [projectId]
            );

            return NextResponse.json({
                success: true,
                project: result.rows[0]
            });

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }

    } catch (error) {
        console.error('Update Project Error:', error);
        return NextResponse.json(
            { error: 'Failed to update project', details: error.message },
            { status: 500 }
        );
    }
}

/**
 * DELETE project
 * DELETE /api/projects/:projectId
 */
export async function DELETE(request, { params }) {
    try {
        const auth = verifyToken(request);
        if (auth.error) {
            return NextResponse.json(
                { error: auth.error },
                { status: auth.status }
            );
        }

        const userId = auth.userId;
        const { projectId } = params;

        const result = await pool.query(
            'DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING id',
            [projectId, userId]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Project deleted successfully'
        });

    } catch (error) {
        console.error('Delete Project Error:', error);
        return NextResponse.json(
            { error: 'Failed to delete project', details: error.message },
            { status: 500 }
        );
    }
}