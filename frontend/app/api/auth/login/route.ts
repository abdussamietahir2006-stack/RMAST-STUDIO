import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Admin } from '@/models/Admin';
import { signToken } from '@/lib/auth';
import { ok, err } from '@/lib/response';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return err('Email and password are required.');
    await connectDB();
    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.comparePassword(password)))
      return err('Invalid email or password.', 401);
    const token = signToken({ email: admin.email, role: admin.role });
    return ok({ token, admin: { email: admin.email, role: admin.role } }, 'Login successful.');
  } catch { return err('Server error.', 500); }
}