import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Create tables
    await sql`
      CREATE TABLE IF NOT EXISTS airports (
        id SERIAL PRIMARY KEY,
        code VARCHAR(3) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        city VARCHAR(255) NOT NULL,
        country VARCHAR(255) NOT NULL
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS flights (
        id SERIAL PRIMARY KEY,
        flight_number VARCHAR(10) NOT NULL,
        airline VARCHAR(100) NOT NULL,
        airline_code VARCHAR(5) NOT NULL,
        origin_code VARCHAR(3) NOT NULL,
        destination_code VARCHAR(3) NOT NULL,
        departure_date DATE NOT NULL,
        departure_time TIME NOT NULL,
        arrival_time TIME NOT NULL,
        duration VARCHAR(20) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        cabin_class VARCHAR(20) NOT NULL,
        available_seats INT NOT NULL,
        stops INT DEFAULT 0
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        flight_id INT NOT NULL,
        passenger_name VARCHAR(255) NOT NULL,
        passenger_email VARCHAR(255) NOT NULL,
        passengers INT NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        booking_ref VARCHAR(20) UNIQUE NOT NULL,
        status VARCHAR(20) DEFAULT 'confirmed',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Seed airports
    await sql`DELETE FROM airports`;
    await sql`
      INSERT INTO airports (code, name, city, country) VALUES
        ('MNL', 'Ninoy Aquino International Airport', 'Manila', 'Philippines'),
        ('CEB', 'Mactan-Cebu International Airport', 'Cebu', 'Philippines'),
        ('DVO', 'Francisco Bangoy International Airport', 'Davao', 'Philippines'),
        ('SIN', 'Singapore Changi Airport', 'Singapore', 'Singapore'),
        ('KUL', 'Kuala Lumpur International Airport', 'Kuala Lumpur', 'Malaysia'),
        ('HKG', 'Hong Kong International Airport', 'Hong Kong', 'China'),
        ('NRT', 'Narita International Airport', 'Tokyo', 'Japan'),
        ('SYD', 'Sydney Kingsford Smith Airport', 'Sydney', 'Australia'),
        ('DXB', 'Dubai International Airport', 'Dubai', 'UAE'),
        ('LHR', 'Heathrow Airport', 'London', 'UK'),
        ('ICN', 'Incheon International Airport', 'Seoul', 'South Korea'),
        ('BKK', 'Suvarnabhumi Airport', 'Bangkok', 'Thailand'),
        ('TPE', 'Taoyuan International Airport', 'Taipei', 'Taiwan'),
        ('PER', 'Perth Airport', 'Perth', 'Australia'),
        ('CGK', 'Soekarno-Hatta International Airport', 'Jakarta', 'Indonesia')
      ON CONFLICT (code) DO NOTHING
    `;

    // Seed flights - generate for next 30 days
    await sql`DELETE FROM flights`;

    const routes = [
      ['MNL','SIN','PR','Philippine Airlines','PR'],
      ['MNL','SIN','5J','Cebu Pacific','5J'],
      ['MNL','HKG','CX','Cathay Pacific','CX'],
      ['MNL','NRT','PR','Philippine Airlines','PR'],
      ['MNL','KUL','AK','AirAsia','AK'],
      ['MNL','DXB','EK','Emirates','EK'],
      ['MNL','LHR','BA','British Airways','BA'],
      ['MNL','SYD','QF','Qantas','QF'],
      ['MNL','BKK','TG','Thai Airways','TG'],
      ['MNL','ICN','KE','Korean Air','KE'],
      ['CEB','SIN','5J','Cebu Pacific','5J'],
      ['CEB','HKG','CX','Cathay Pacific','CX'],
      ['CEB','KUL','AK','AirAsia','AK'],
      ['SIN','NRT','SQ','Singapore Airlines','SQ'],
      ['SIN','LHR','SQ','Singapore Airlines','SQ'],
      ['HKG','NRT','CX','Cathay Pacific','CX'],
      ['DXB','LHR','EK','Emirates','EK'],
    ];

    const cabins = ['Economy', 'Business', 'First'];
    const basePrices: Record<string, number> = {
      'MNL-SIN': 4500, 'MNL-HKG': 6200, 'MNL-NRT': 14000,
      'MNL-KUL': 3800, 'MNL-DXB': 18000, 'MNL-LHR': 28000,
      'MNL-SYD': 22000, 'MNL-BKK': 5500, 'MNL-ICN': 9800,
      'CEB-SIN': 5200, 'CEB-HKG': 7000, 'CEB-KUL': 4200,
      'SIN-NRT': 12000, 'SIN-LHR': 22000, 'HKG-NRT': 10000,
      'DXB-LHR': 15000,
    };

    const times = [
      ['06:00','08:30','2h 30m'], ['08:15','11:00','2h 45m'],
      ['10:30','13:15','2h 45m'], ['13:00','15:45','2h 45m'],
      ['15:30','18:20','2h 50m'], ['17:45','20:30','2h 45m'],
      ['20:00','22:45','2h 45m'], ['22:30','01:15','2h 45m'],
    ];

    let flightNum = 100;
    for (const [orig, dest, airlineCode, airlineName] of routes) {
      const key = `${orig}-${dest}`;
      const basePrice = basePrices[key] || 8000;

      for (let day = 0; day < 30; day++) {
        const date = new Date();
        date.setDate(date.getDate() + day);
        const dateStr = date.toISOString().split('T')[0];

        for (const [dep, arr, dur] of times.slice(0, 4)) {
          for (const cabin of cabins) {
            const multiplier = cabin === 'Business' ? 3.2 : cabin === 'First' ? 6 : 1;
            const priceVariation = 0.85 + Math.random() * 0.3;
            const price = Math.round(basePrice * multiplier * priceVariation);
            const seats = Math.floor(20 + Math.random() * 80);
            flightNum++;

            await sql`
              INSERT INTO flights 
                (flight_number, airline, airline_code, origin_code, destination_code, 
                 departure_date, departure_time, arrival_time, duration, price, cabin_class, available_seats, stops)
              VALUES 
                (${airlineCode + flightNum}, ${airlineName}, ${airlineCode}, ${orig}, ${dest},
                 ${dateStr}, ${dep}, ${arr}, ${dur}, ${price}, ${cabin}, ${seats}, 0)
            `;
          }
        }
      }
    }

    return NextResponse.json({ message: '✅ Database seeded successfully!' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}