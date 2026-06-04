import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Booking } from '@/models/index';
import { authenticate } from '@/lib/auth';
import { ok, err } from '@/lib/response';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!authenticate(req)) return err('Unauthorized.', 401);
  await connectDB();
  const { id } = await params;
  const booking = await Booking.findByIdAndDelete(id);
  if (!booking) return err('Booking not found.', 404);
  return ok(null, 'Booking deleted.');
}