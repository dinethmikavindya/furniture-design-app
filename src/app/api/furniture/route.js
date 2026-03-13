import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  
  try {
    let query = 'SELECT * FROM furniture_catalog';
    let values = [];
    if (category && category !== 'All') {
      query += ' WHERE category = $1';
      values = [category];
    }
    query += ' ORDER BY name';
    const { rows } = await pool.query(query, values);
    return Response.json({ furniture: rows });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
