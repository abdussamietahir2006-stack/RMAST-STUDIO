import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Subscriber } from '@/models/index';
import { authenticate } from '@/lib/auth';
import { ok, err } from '@/lib/response';

export async function GET(req: NextRequest) {
  if (!authenticate(req)) return err('Unauthorized.', 401);
  await connectDB();
  const total       = await Subscriber.countDocuments();
  const subscribers = await Subscriber.find().sort({ createdAt: -1 }).limit(200).lean();
  return ok({ subscribers, total }, 'Subscribers fetched.');
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, source } = await req.json();
    if (!email) return err('Email is required.');
    const existing = await Subscriber.findOne({ email });
    if (existing) return ok(null, 'You are already subscribed.');
    const sub = await Subscriber.create({ email, source });
    return ok(sub, 'Subscribed successfully.', 201);
  } catch (e: any) {
    if (e.code === 11000) return ok(null, 'You are already subscribed.');
    return err('Server error.', 500);
  }
}

export async function DELETE(req: NextRequest) {
  if (!authenticate(req)) return err('Unauthorized.', 401);
  await connectDB();
  await Subscriber.deleteMany({});
  return ok(null, 'All subscribers deleted.');
}