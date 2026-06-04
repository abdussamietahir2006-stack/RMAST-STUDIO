import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { PageContent } from '@/models/index';
import { authenticate } from '@/lib/auth';
import { ok, err } from '@/lib/response';

export async function GET(req: NextRequest, { params }: { params: Promise<{ pageSlug: string }> }) {
  await connectDB();
  const { pageSlug } = await params;
  const page = await PageContent.findOne({ pageSlug }).lean();
  return ok(page ?? { pageSlug, content: {}, images: {} }, 'Page content fetched.');
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ pageSlug: string }> }) {
  if (!authenticate(req)) return err('Unauthorized.', 401);
  await connectDB();
  const { pageSlug } = await params;
  const { content, images } = await req.json();
  const update: Record<string, unknown> = { pageSlug };
  if (content !== undefined) update.content = content;
  if (images  !== undefined) update.images  = images;
  const page = await PageContent.findOneAndUpdate(
    { pageSlug }, { $set: update }, { new: true, upsert: true }
  ).lean();
  return ok(page, 'Page content saved.');
}