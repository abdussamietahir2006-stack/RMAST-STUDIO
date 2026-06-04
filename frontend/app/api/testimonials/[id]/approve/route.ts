import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Testimonial } from '@/models/index';
import { authenticate } from '@/lib/auth';
import { ok, err } from '@/lib/response';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!authenticate(req)) return err('Unauthorized.', 401);
  await connectDB();
  const { id } = await params;
  const { approved, showOnWebsite } = await req.json();
  const updateData: Record<string, unknown> = {};
  if (typeof approved === 'boolean') updateData.approved = approved;
  if (typeof showOnWebsite === 'boolean') updateData.showOnWebsite = showOnWebsite;

  if (Object.keys(updateData).length === 0) return err('No fields to update.');

  const t = await Testimonial.findByIdAndUpdate(id, updateData, { new: true }).lean();
  if (!t) return err('Testimonial not found.', 404);
  return ok(t, 'Testimonial status updated.');
}