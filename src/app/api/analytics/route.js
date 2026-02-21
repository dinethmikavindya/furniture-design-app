import { NextResponse } from 'next/server';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        const totalProjectsQuery = await pool.query(
            'SELECT COUNT(*) as count FROM projects WHERE user_id = $1',
            [userId]
        );
        const totalProjects = parseInt(totalProjectsQuery.rows[0].count);

        const projectsThisWeekQuery = await pool.query(
            `SELECT COUNT(*) as count FROM projects 
       WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '7 days'`,
            [userId]
        );
        const projectsThisWeek = parseInt(projectsThisWeekQuery.rows[0].count);

        const projectsThisMonthQuery = await pool.query(
            `SELECT COUNT(*) as count FROM projects 
       WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '30 days'`,
            [userId]
        );
        const projectsThisMonth = parseInt(projectsThisMonthQuery.rows[0].count);

        const recentProjectsQuery = await pool.query(
            `SELECT id, name, created_at, updated_at, thumbnail_url 
       FROM projects WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 5`,
            [userId]
        );
        const recentProjects = recentProjectsQuery.rows;

        const furnitureUsageQuery = await pool.query(
            `SELECT 
        jsonb_array_elements(ds.furniture_items)->>'type' as furniture_type,
        COUNT(*) as usage_count
       FROM design_states ds
       JOIN projects p ON ds.project_id = p.id
       WHERE p.user_id = $1
       GROUP BY furniture_type
       ORDER BY usage_count DESC LIMIT 5`,
            [userId]
        );
        const mostUsedFurniture = furnitureUsageQuery.rows;

        const totalFurnitureQuery = await pool.query(
            `SELECT SUM(jsonb_array_length(ds.furniture_items)) as total
       FROM design_states ds
       JOIN projects p ON ds.project_id = p.id
       WHERE p.user_id = $1`,
            [userId]
        );
        const totalFurniture = parseInt(totalFurnitureQuery.rows[0].total || 0);

        return NextResponse.json({
            designStats: {
                total: totalProjects,
                thisWeek: projectsThisWeek,
                thisMonth: projectsThisMonth,
            },
            recentProjects: recentProjects,
            furnitureStats: {
                totalFurniture: totalFurniture,
                mostUsed: mostUsedFurniture,
            },
            userActivity: {
                lastActive: new Date(),
                projectsCreated: totalProjects,
            }
        });

    } catch (error) {
        console.error('Analytics API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch analytics', details: error.message },
            { status: 500 }
        );
    }
}