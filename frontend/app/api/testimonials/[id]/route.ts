import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Testimonial } from '@/models/index';
import { authenticate } from '@/lib/auth';
import { ok, err } from '@/lib/response';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!authenticate(req)) return err('Unauthorized.', 401);
  await connectDB();
  const { id } = await params;
  const t = await Testimonial.findByIdAndDelete(id);
  if (!t) return err('Testimonial not found.', 404);
  return ok(null, 'Testimonial deleted.');
}