import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Lead } from '@/models/index';
import { authenticate } from '@/lib/auth';
import { ok, err } from '@/lib/response';

export async function GET(req: NextRequest) {
  if (!authenticate(req)) return err('Unauthorized.', 401);
  await connectDB();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const search = searchParams.get('search');
  const limit  = parseInt(searchParams.get('limit') || '50');

  const filter: Record<string, unknown> = {};
  if (status && status !== 'all') filter.status = status;
  if (search) filter.$or = [
    { name:  { $regex: search, $options: 'i' } },
    { email: { $regex: search, $options: 'i' } },
  ];

  const total = await Lead.countDocuments(filter);
  const leads = await Lead.find(filter).sort({ createdAt: -1 }).limit(limit).lean();
  return ok({ leads, total }, 'Leads fetched.');
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, email, message, company, phone, source, service } = await req.json();
    if (!name || !email || !message) return err('Name, email and message are required.');
    const lead = await Lead.create({ name, email, message, company, phone, source, service });
    return ok(lead, 'Message received. We will get back to you within 24 hours.', 201);
  } catch { return err('Server error.', 500); }
}