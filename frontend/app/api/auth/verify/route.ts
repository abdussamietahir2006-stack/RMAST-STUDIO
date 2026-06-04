import { NextRequest } from 'next/server';
import { authenticate } from '@/lib/auth';
import { ok, err } from '@/lib/response';

export async function GET(req: NextRequest) {
  const admin = authenticate(req);
  if (!admin) return err('Unauthorized.', 401);
  return ok({ admin }, 'Token valid.');
}