import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
  const body = await request.json();
  const { flight_id, passenger_name, passenger_email, passengers, total_price } = body;

  try {
    const ref = 'KAI' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const rows = await sql`
      INSERT INTO bookings (
        flight_id, passenger_name, passenger_email, 
        passengers, total_price, booking_ref, status
      )
      VALUES (
        ${flight_id}, ${passenger_name}, ${passenger_email}, 
        ${passengers}, ${total_price}, ${ref}, 'confirmed'
      )
      RETURNING *
    `;
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Booking failed' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ref = searchParams.get('ref') || '';

  try {
    const rows = await sql`
      SELECT b.*, 
        f.flight_number, f.airline, f.origin_code, f.destination_code,
        f.departure_date, f.departure_time, f.arrival_time, f.duration, f.cabin_class,
        a1.city as origin_city, a2.city as dest_city
      FROM bookings b
      JOIN flights f ON b.flight_id = f.id
      JOIN airports a1 ON f.origin_code = a1.code
      JOIN airports a2 ON f.destination_code = a2.code
      WHERE b.booking_ref = ${ref}
    `;
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 });
  }
}