const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// CREATE - Create new project
router.post('/', async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user.userId;

        if (!name) {
            return res.status(400).json({ error: 'Project name is required' });
        }

        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // Create project
            const projectResult = await client.query(
                `INSERT INTO projects (user_id, name) 
         VALUES ($1, $2) 
         RETURNING id, name, thumbnail_url, created_at, updated_at`,
                [userId, name]
            );

            const project = projectResult.rows[0];

            // Create empty design state
            await client.query(
                `INSERT INTO design_states (project_id, room_config, furniture_items)
         VALUES ($1, $2, $3)`,
                [project.id, JSON.stringify({}), JSON.stringify([])]
            );

            await client.query('COMMIT');

            res.status(201).json({
                message: 'Project created successfully',
                project
            });

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }

    } catch (error) {
        console.error('Create project error:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

// READ - Get all projects for logged-in user
router.get('/', async (req, res) => {
    try {
        const userId = req.user.userId;

        const result = await pool.query(
            `SELECT id, name, thumbnail_url, created_at, updated_at
       FROM projects
       WHERE user_id = $1
       ORDER BY updated_at DESC`,
            [userId]
        );

        res.json({ projects: result.rows });

    } catch (error) {
        console.error('Get projects error:', error);
        res.status(500).json({ error: 'Failed to get projects' });
    }
});

// READ - Get single project with design data
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const result = await pool.query(
            `SELECT 
        p.id, p.name, p.thumbnail_url, p.created_at, p.updated_at,
        d.room_config, d.furniture_items
       FROM projects p
       LEFT JOIN design_states d ON p.id = d.project_id
       WHERE p.id = $1 AND p.user_id = $2`,
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.json({ project: result.rows[0] });

    } catch (error) {
        console.error('Get project error:', error);
        res.status(500).json({ error: 'Failed to get project' });
    }
});

// UPDATE - Save design state
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const { name, roomConfig, furnitureItems } = req.body;

        // Verify user owns this project
        const checkResult = await pool.query(
            'SELECT id FROM projects WHERE id = $1 AND user_id = $2',
            [id, userId]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // Update project name if provided
            if (name) {
                await client.query(
                    'UPDATE projects SET name = $1, updated_at = NOW() WHERE id = $2',
                    [name, id]
                );
            }

            // Update design state
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
                values.push(id);

                await client.query(
                    `UPDATE design_states 
           SET ${updates.join(', ')} 
           WHERE project_id = $${paramCount}`,
                    values
                );

                // Update project timestamp
                await client.query(
                    'UPDATE projects SET updated_at = NOW() WHERE id = $1',
                    [id]
                );
            }

            await client.query('COMMIT');

            // Fetch updated project
            const result = await pool.query(
                `SELECT 
          p.id, p.name, p.thumbnail_url, p.created_at, p.updated_at,
          d.room_config, d.furniture_items
         FROM projects p
         LEFT JOIN design_states d ON p.id = d.project_id
         WHERE p.id = $1`,
                [id]
            );

            res.json({
                message: 'Project updated successfully',
                project: result.rows[0]
            });

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }

    } catch (error) {
        console.error('Update project error:', error);
        res.status(500).json({ error: 'Failed to update project' });
    }
});

// DELETE - Delete project
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const result = await pool.query(
            'DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING id',
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.json({ message: 'Project deleted successfully' });

    } catch (error) {
        console.error('Delete project error:', error);
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

module.exports = router;