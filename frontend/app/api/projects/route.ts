import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Project } from '@/models/index';
import { authenticate } from '@/lib/auth';
import { ok, err } from '@/lib/response';

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const filter: Record<string, unknown> = {};
  if (category && category !== 'All') filter.category = category;
  const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 }).lean();
  return ok(projects, 'Projects fetched.');
}

export async function POST(req: NextRequest) {
  if (!authenticate(req)) return err('Unauthorized.', 401);
  try {
    await connectDB();
    const body = await req.json();
    if (!body.title) return err('Title is required.');
    const project = await Project.create(body);
    return ok(project, 'Project created.', 201);
  } catch { return err('Server error.', 500); }
}