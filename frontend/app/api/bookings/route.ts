import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Booking } from '@/models/index';
import { authenticate } from '@/lib/auth';
import { ok, err } from '@/lib/response';

export async function GET(req: NextRequest) {
  if (!authenticate(req)) return err('Unauthorized.', 401);
  await connectDB();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const filter: Record<string, unknown> = {};
  if (status && status !== 'all') filter.status = status;
  const total    = await Booking.countDocuments(filter);
  const bookings = await Booking.find(filter).sort({ createdAt: -1 }).limit(100).lean();
  return ok({ bookings, total }, 'Bookings fetched.');
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    if (!body.name || !body.email) return err('Name and email are required.');
    const booking = await Booking.create(body);
    return ok(booking, 'Booking confirmed. We will reach out shortly.', 201);
  } catch { return err('Server error.', 500); }
}