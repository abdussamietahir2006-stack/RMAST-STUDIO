import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Lead } from '@/models/index';
import { authenticate } from '@/lib/auth';
import { ok, err } from '@/lib/response';


export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  return Response.json({
    success: true,
    id
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  console.log('DELETE LEAD ID:', id);

  if (!authenticate(req)) {
    console.log('AUTH FAILED');
    return err('Unauthorized.', 401);
  }

  await connectDB();

  const lead = await Lead.findByIdAndDelete(id);

  console.log('FOUND LEAD:', lead);

  if (!lead) {
    console.log('LEAD NOT FOUND IN DATABASE');
    return err('Lead not found.', 404);
  }

  return ok(null, 'Lead deleted.');
}