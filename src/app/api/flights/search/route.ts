import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const date = searchParams.get('date') || '';
  const passengers = parseInt(searchParams.get('passengers') || '1');
  const cabin = searchParams.get('cabin') || 'Economy';

  try {
    const sql = neon(process.env.DATABASE_URL!);
    const rows = await sql`
      SELECT 
        f.*,
        a1.name as origin_name,
        a1.city as origin_city,
        a2.name as dest_name,
        a2.city as dest_city
      FROM flights f
      JOIN airports a1 ON f.origin_code = a1.code
      JOIN airports a2 ON f.destination_code = a2.code
      WHERE 
        f.origin_code = UPPER(${from}) AND
        f.destination_code = UPPER(${to}) AND
        f.departure_date = ${date} AND
        f.cabin_class = ${cabin} AND
        f.available_seats >= ${passengers}
      ORDER BY f.price ASC
    `;
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch flights' }, { status: 500 });
  }
}