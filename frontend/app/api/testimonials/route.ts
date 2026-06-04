import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Testimonial } from '@/models/index';
import { authenticate } from '@/lib/auth';
import { ok, err } from '@/lib/response';

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const approvedParam = searchParams.get('approved');

  const filter: Record<string, unknown> = {};
  // Public fetch: ?approved=true returns only approved
  // Admin fetch (authenticated): returns all
  const admin = authenticate(req);
  if (!admin) {
    filter.approved = true;
  } else if (approvedParam === 'true') {
    filter.approved = true;
  } else if (approvedParam === 'false') {
    filter.approved = false;
  }

  const total        = await Testimonial.countDocuments(filter);
  const testimonials = await Testimonial.find(filter).sort({ createdAt: -1 }).lean();
  return ok({ testimonials, total }, 'Testimonials fetched.');
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    if (!body.name || !body.quote) return err('Name and quote are required.');
    if (body.quote.length < 20) return err('Quote must be at least 20 characters.');
    const testimonial = await Testimonial.create({ ...body, approved: false });
    return ok(testimonial, 'Review submitted. It will appear after approval.', 201);
  } catch { return err('Server error.', 500); }
}