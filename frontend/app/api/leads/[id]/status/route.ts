import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Lead } from '@/models/index';
import { authenticate } from '@/lib/auth';
import { ok, err } from '@/lib/response';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!authenticate(req)) return err('Unauthorized.', 401);
  await connectDB();
  const { id } = await params;
  const { status } = await req.json();
  if (!['new','contacted','qualified','converted','lost'].includes(status))
    return err('Invalid status.');
  const lead = await Lead.findByIdAndUpdate(id, { status }, { new: true }).lean();
  if (!lead) return err('Lead not found.', 404);
  return ok(lead, 'Lead status updated.');
}