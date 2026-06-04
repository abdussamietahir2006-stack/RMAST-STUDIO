import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { PasswordReset } from '@/models/index';
import { ok, err } from '@/lib/response';

export async function POST(req: NextRequest) {
  try {
    const { token, email } = await req.json();
    if (!token || !email) return err('Token and email are required.');
    await connectDB();
    const record = await PasswordReset.findOne({ token, email, expiresAt: { $gt: new Date() } });
    if (!record) return err('Invalid or expired reset token.', 401);
    return ok({ email }, 'Token is valid.');
  } catch { return err('Server error.', 500); }
}