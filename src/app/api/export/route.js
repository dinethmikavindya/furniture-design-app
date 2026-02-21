import { NextResponse } from 'next/server';
import { createCanvas } from 'canvas';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

/**
 * Export design as image (PNG or JPG)
 * GET /api/export?projectId={id}&format={png|jpg}
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('projectId');
        const format = searchParams.get('format') || 'png';
        const width = parseInt(searchParams.get('width')) || 800;
        const height = parseInt(searchParams.get('height')) || 600;

        if (!projectId) {
            return NextResponse.json(
                { error: 'Project ID required' },
                { status: 400 }
            );
        }

        // Get project and design data
        const projectQuery = await pool.query(
            'SELECT * FROM projects WHERE id = $1',
            [projectId]
        );

        if (projectQuery.rows.length === 0) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        const project = projectQuery.rows[0];

        // Get design state
        const designQuery = await pool.query(
            'SELECT * FROM design_states WHERE project_id = $1',
            [projectId]
        );

        const designState = designQuery.rows[0] || {
            room_config: {},
            furniture_items: []
        };

        // Create canvas
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Draw background
        const bgColor = designState.room_config.floorColor || '#f5f5f5';
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);

        // Draw room outline
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 3;
        ctx.strokeRect(0, 0, width, height);

        // Draw grid (if enabled)
        const gridSize = 20;
        ctx.strokeStyle = '#dddddd';
        ctx.lineWidth = 1;

        // Vertical grid lines
        for (let x = 0; x <= width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        // Horizontal grid lines
        for (let y = 0; y <= height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Draw furniture
        if (designState.furniture_items && Array.isArray(designState.furniture_items)) {
            designState.furniture_items.forEach((item, index) => {
                ctx.save();

                // Get furniture position and size
                const x = item.x || (100 + index * 120);
                const y = item.y || (100 + index * 100);
                const w = item.width || 80;
                const h = item.height || 80;
                const rotation = item.rotation || 0;

                // Translate to furniture center
                ctx.translate(x + w / 2, y + h / 2);

                // Rotate
                if (rotation) {
                    ctx.rotate((rotation * Math.PI) / 180);
                }

                // Draw furniture body
                ctx.fillStyle = item.color || '#8B4513';
                ctx.fillRect(-w / 2, -h / 2, w, h);

                // Draw furniture border
                ctx.strokeStyle = '#333333';
                ctx.lineWidth = 2;
                ctx.strokeRect(-w / 2, -h / 2, w, h);

                // Draw furniture label
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 14px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const label = item.type || item.name || 'Item';
                ctx.fillText(label.toUpperCase(), 0, 0);

                ctx.restore();
            });
        }

        // Add project name at top
        ctx.fillStyle = '#333333';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(project.name || 'Design', width / 2, 30);

        // Add timestamp at bottom
        ctx.fillStyle = '#666666';
        ctx.font = '12px Arial';
        const timestamp = new Date().toLocaleString();
        ctx.fillText(`Exported: ${timestamp}`, width / 2, height - 20);

        // Convert to buffer
        let buffer;
        let mimeType;
        let extension;

        if (format === 'jpg' || format === 'jpeg') {
            buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
            mimeType = 'image/jpeg';
            extension = 'jpg';
        } else {
            buffer = canvas.toBuffer('image/png');
            mimeType = 'image/png';
            extension = 'png';
        }

        // Return image
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': mimeType,
                'Content-Disposition': `attachment; filename="${project.name || 'design'}.${extension}"`,
                'Content-Length': buffer.length.toString(),
            },
        });

    } catch (error) {
        console.error('Export API Error:', error);
        return NextResponse.json(
            { error: 'Failed to export design', details: error.message },
            { status: 500 }
        );
    }
}