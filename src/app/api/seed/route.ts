import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);

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

    await sql`
      INSERT INTO airports (code, name, city, country) VALUES
        ('MNL', 'Ninoy Aquino International Airport', 'Manila', 'Philippines'),
        ('CEB', 'Mactan-Cebu International Airport', 'Cebu', 'Philippines'),
        ('DVO', 'Francisco Bangoy International Airport', 'Davao', 'Philippines'),
        ('ILO', 'Iloilo International Airport', 'Iloilo', 'Philippines'),
        ('BCD', 'Bacolod-Silay Airport', 'Bacolod', 'Philippines'),
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
        ('CGK', 'Soekarno-Hatta International Airport', 'Jakarta', 'Indonesia'),
        ('SGN', 'Tan Son Nhat International Airport', 'Ho Chi Minh City', 'Vietnam'),
        ('HAN', 'Noi Bai International Airport', 'Hanoi', 'Vietnam'),
        ('MFM', 'Macau International Airport', 'Macau', 'China')
      ON CONFLICT (code) DO NOTHING
    `;

    const routes: [string, string, string, string][] = [
      ['MNL','SIN','PR','Philippine Airlines'],
      ['MNL','SIN','5J','Cebu Pacific'],
      ['MNL','SIN','Z2','AirAsia Philippines'],
      ['MNL','HKG','CX','Cathay Pacific'],
      ['MNL','HKG','PR','Philippine Airlines'],
      ['MNL','NRT','PR','Philippine Airlines'],
      ['MNL','NRT','NH','ANA'],
      ['MNL','KUL','AK','AirAsia'],
      ['MNL','KUL','MH','Malaysia Airlines'],
      ['MNL','DXB','EK','Emirates'],
      ['MNL','LHR','BA','British Airways'],
      ['MNL','SYD','QF','Qantas'],
      ['MNL','BKK','TG','Thai Airways'],
      ['MNL','BKK','FD','Thai AirAsia'],
      ['MNL','ICN','KE','Korean Air'],
      ['MNL','ICN','OZ','Asiana Airlines'],
      ['MNL','TPE','CI','China Airlines'],
      ['MNL','CGK','GA','Garuda Indonesia'],
      ['MNL','SGN','VN','Vietnam Airlines'],
      ['CEB','SIN','5J','Cebu Pacific'],
      ['CEB','HKG','CX','Cathay Pacific'],
      ['CEB','KUL','AK','AirAsia'],
      ['CEB','NRT','PR','Philippine Airlines'],
      ['CEB','ICN','KE','Korean Air'],
      ['SIN','NRT','SQ','Singapore Airlines'],
      ['SIN','LHR','SQ','Singapore Airlines'],
      ['SIN','SYD','SQ','Singapore Airlines'],
      ['SIN','DXB','EK','Emirates'],
      ['HKG','NRT','CX','Cathay Pacific'],
      ['DXB','LHR','EK','Emirates'],
    ];

    const cabins = ['Economy', 'Business', 'First'];

    const basePrices: Record<string, number> = {
      'MNL-SIN': 4500,  'MNL-HKG': 6200,  'MNL-NRT': 14000,
      'MNL-KUL': 3800,  'MNL-DXB': 18000, 'MNL-LHR': 28000,
      'MNL-SYD': 22000, 'MNL-BKK': 5500,  'MNL-ICN': 9800,
      'MNL-TPE': 8500,  'MNL-CGK': 6000,  'MNL-SGN': 5000,
      'CEB-SIN': 5200,  'CEB-HKG': 7000,  'CEB-KUL': 4200,
      'CEB-NRT': 15000, 'CEB-ICN': 10500,
      'SIN-NRT': 12000, 'SIN-LHR': 22000, 'SIN-SYD': 18000,
      'SIN-DXB': 14000, 'HKG-NRT': 10000, 'DXB-LHR': 15000,
    };

    const schedules = [
      ['05:00', '07:30', '2h 30m'],
      ['07:15', '09:50', '2h 35m'],
      ['09:30', '12:10', '2h 40m'],
      ['11:45', '14:20', '2h 35m'],
      ['13:00', '15:40', '2h 40m'],
      ['15:20', '17:55', '2h 35m'],
      ['17:30', '20:10', '2h 40m'],
      ['19:45', '22:20', '2h 35m'],
      ['21:00', '23:40', '2h 40m'],
      ['22:55', '01:30', '2h 35m'],
    ];

    let flightNum = 100;

    for (const [orig, dest, airlineCode, airlineName] of routes) {
      const key = `${orig}-${dest}`;
      const basePrice = basePrices[key] || 8000;

      for (let day = 0; day < 60; day++) {
        const date = new Date();
        date.setDate(date.getDate() + day);
        const dateStr = date.toISOString().split('T')[0];

        const dailySchedules = schedules.slice(0, Math.floor(3 + Math.random() * 4));

        for (const [dep, arr, dur] of dailySchedules) {
          for (const cabin of cabins) {
            const multiplier = cabin === 'Business' ? 3.2 : cabin === 'First' ? 6.5 : 1;
            const variation = 0.8 + Math.random() * 0.4;
            const price = Math.round(basePrice * multiplier * variation);
            const seats = Math.floor(15 + Math.random() * 120);
            flightNum++;

            await sql`
              INSERT INTO flights (
                flight_number, airline, airline_code,
                origin_code, destination_code,
                departure_date, departure_time, arrival_time,
                duration, price, cabin_class, available_seats, stops
              ) VALUES (
                ${airlineCode + flightNum},
                ${airlineName},
                ${airlineCode},
                ${orig}, ${dest},
                ${dateStr}, ${dep}, ${arr},
                ${dur}, ${price}, ${cabin}, ${seats}, 0
              )
            `;
          }
        }
      }
    }

    const totalFlights = await sql`SELECT COUNT(*) as count FROM flights`;
    const totalAirports = await sql`SELECT COUNT(*) as count FROM airports`;

    return NextResponse.json({
      message: '✅ Database seeded successfully!',
      airports: totalAirports[0].count,
      flights: totalFlights[0].count,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}