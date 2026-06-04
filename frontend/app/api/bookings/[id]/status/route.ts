import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Booking } from '@/models/index';
import { authenticate } from '@/lib/auth';
import { ok, err } from '@/lib/response';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!authenticate(req)) return err('Unauthorized.', 401);
  await connectDB();
  const { id } = await params;
  const { status } = await req.json();
  if (!['pending','confirmed','cancelled','completed'].includes(status))
    return err('Invalid status.');
  const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true }).lean();
  if (!booking) return err('Booking not found.', 404);
  return ok(booking, 'Booking updated.');
}