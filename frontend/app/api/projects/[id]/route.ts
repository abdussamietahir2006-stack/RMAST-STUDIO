import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Project } from '@/models/index';
import { authenticate } from '@/lib/auth';
import { ok, err } from '@/lib/response';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!authenticate(req)) return err('Unauthorized.', 401);
  await connectDB();
  const { id } = await params;
  const body = await req.json();
  const project = await Project.findByIdAndUpdate(id, body, { new: true }).lean();
  if (!project) return err('Project not found.', 404);
  return ok(project, 'Project updated.');
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!authenticate(req)) return err('Unauthorized.', 401);
  await connectDB();
  const { id } = await params;
  const project = await Project.findByIdAndDelete(id);
  if (!project) return err('Project not found.', 404);
  return ok(null, 'Project deleted.');
}