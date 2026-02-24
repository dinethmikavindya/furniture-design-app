import { NextResponse } from 'next/server';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

/**
 * GET furniture item properties
 * GET /api/projects/:projectId/furniture/:furnitureId
 */
export async function GET(request, { params }) {
    try {
        const { projectId, furnitureId } = params;

        // Get design state
        const query = await pool.query(
            'SELECT furniture_items FROM design_states WHERE project_id = $1',
            [projectId]
        );

        if (query.rows.length === 0) {
            return NextResponse.json(
                { error: 'Design state not found' },
                { status: 404 }
            );
        }

        const furnitureItems = query.rows[0].furniture_items || [];
        const furniture = furnitureItems.find(item => item.id === furnitureId);

        if (!furniture) {
            return NextResponse.json(
                { error: 'Furniture item not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(furniture);

    } catch (error) {
        console.error('Furniture Properties GET Error:', error);
        return NextResponse.json(
            { error: 'Failed to get furniture properties', details: error.message },
            { status: 500 }
        );
    }
}

/**
 * UPDATE furniture item properties
 * PUT /api/projects/:projectId/furniture/:furnitureId
 * Body: { width?, height?, depth?, rotation?, color?, x?, y? }
 */
export async function PUT(request, { params }) {
    try {
        const { projectId, furnitureId } = params;
        const body = await request.json();
        const { width, height, depth, rotation, color, x, y } = body;

        // Validate dimensions
        if (width && (width < 10 || width > 500)) {
            return NextResponse.json(
                { error: 'Width must be between 10 and 500 cm' },
                { status: 400 }
            );
        }

        if (height && (height < 10 || height > 500)) {
            return NextResponse.json(
                { error: 'Height must be between 10 and 500 cm' },
                { status: 400 }
            );
        }

        if (depth && (depth < 10 || depth > 500)) {
            return NextResponse.json(
                { error: 'Depth must be between 10 and 500 cm' },
                { status: 400 }
            );
        }

        if (rotation !== undefined && (rotation < 0 || rotation >= 360)) {
            return NextResponse.json(
                { error: 'Rotation must be between 0 and 359 degrees' },
                { status: 400 }
            );
        }

        // Get current design state
        const query = await pool.query(
            'SELECT furniture_items FROM design_states WHERE project_id = $1',
            [projectId]
        );

        if (query.rows.length === 0) {
            return NextResponse.json(
                { error: 'Design state not found' },
                { status: 404 }
            );
        }

        const furnitureItems = query.rows[0].furniture_items || [];
        const furnitureIndex = furnitureItems.findIndex(item => item.id === furnitureId);

        if (furnitureIndex === -1) {
            return NextResponse.json(
                { error: 'Furniture item not found' },
                { status: 404 }
            );
        }

        // Update furniture properties
        const updatedFurniture = {
            ...furnitureItems[furnitureIndex],
            ...(width !== undefined && { width }),
            ...(height !== undefined && { height }),
            ...(depth !== undefined && { depth }),
            ...(rotation !== undefined && { rotation }),
            ...(color && { color }),
            ...(x !== undefined && { x }),
            ...(y !== undefined && { y }),
        };

        furnitureItems[furnitureIndex] = updatedFurniture;

        // Update design state
        const updateQuery = await pool.query(
            `UPDATE design_states 
       SET furniture_items = $1, updated_at = NOW() 
       WHERE project_id = $2 
       RETURNING furniture_items`,
            [JSON.stringify(furnitureItems), projectId]
        );

        // Update project's updated_at
        await pool.query(
            'UPDATE projects SET updated_at = NOW() WHERE id = $1',
            [projectId]
        );

        return NextResponse.json({
            success: true,
            furniture: updatedFurniture
        });

    } catch (error) {
        console.error('Furniture Properties PUT Error:', error);
        return NextResponse.json(
            { error: 'Failed to update furniture properties', details: error.message },
            { status: 500 }
        );
    }
}

/**
 * DELETE furniture item
 * DELETE /api/projects/:projectId/furniture/:furnitureId
 */
export async function DELETE(request, { params }) {
    try {
        const { projectId, furnitureId } = params;

        // Get current design state
        const query = await pool.query(
            'SELECT furniture_items FROM design_states WHERE project_id = $1',
            [projectId]
        );

        if (query.rows.length === 0) {
            return NextResponse.json(
                { error: 'Design state not found' },
                { status: 404 }
            );
        }

        const furnitureItems = query.rows[0].furniture_items || [];
        const furnitureIndex = furnitureItems.findIndex(item => item.id === furnitureId);

        if (furnitureIndex === -1) {
            return NextResponse.json(
                { error: 'Furniture item not found' },
                { status: 404 }
            );
        }

        // Remove furniture item
        furnitureItems.splice(furnitureIndex, 1);

        // Update design state
        await pool.query(
            `UPDATE design_states 
       SET furniture_items = $1, updated_at = NOW() 
       WHERE project_id = $2`,
            [JSON.stringify(furnitureItems), projectId]
        );

        // Update project's updated_at
        await pool.query(
            'UPDATE projects SET updated_at = NOW() WHERE id = $1',
            [projectId]
        );

        return NextResponse.json({
            success: true,
            message: 'Furniture item deleted'
        });

    } catch (error) {
        console.error('Furniture DELETE Error:', error);
        return NextResponse.json(
            { error: 'Failed to delete furniture item', details: error.message },
            { status: 500 }
        );
    }
}