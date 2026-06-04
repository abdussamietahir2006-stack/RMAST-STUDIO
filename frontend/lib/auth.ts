import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const SECRET = process.env.JWT_SECRET!;

export function signToken(payload: { email: string; role: string }) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { email: string; role: string } | null {
  try { return jwt.verify(token, SECRET) as { email: string; role: string }; }
  catch { return null; }
}

export function authenticate(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  return verifyToken(auth.slice(7));
}