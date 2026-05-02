import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { flight_id, passenger_name, passenger_email, passengers, total_price } = body;

  try {
    const ref = 'KAI' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const { rows } = await sql`
      INSERT INTO bookings (flight_id, passenger_name, passenger_email, passengers, total_price, booking_ref, status)
      VALUES (${flight_id}, ${passenger_name}, ${passenger_email}, ${passengers}, ${total_price}, ${ref}, 'confirmed')
      RETURNING *
    `;
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Booking failed' }, { status: 500 });
  }
}