import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Testimonial } from '@/models/index';
import { authenticate } from '@/lib/auth';
import { ok, err } from '@/lib/response';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!authenticate(req)) return err('Unauthorized.', 401);
  await connectDB();
  const { id } = await params;
  const { approved } = await req.json();
  if (typeof approved !== 'boolean') return err('approved must be a boolean.');
  const t = await Testimonial.findByIdAndUpdate(id, { approved }, { new: true }).lean();
  if (!t) return err('Testimonial not found.', 404);
  return ok(t, `Testimonial ${approved ? 'approved' : 'rejected'}.`);
}