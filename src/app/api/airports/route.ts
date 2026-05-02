import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';

  try {
    const { rows } = await sql`
      SELECT code, name, country, city
      FROM airports
      WHERE 
        LOWER(name) LIKE LOWER(${'%' + query + '%'}) OR
        LOWER(city) LIKE LOWER(${'%' + query + '%'}) OR
        LOWER(code) LIKE LOWER(${'%' + query + '%'})
      LIMIT 10
    `;
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch airports' }, { status: 500 });
  }
}