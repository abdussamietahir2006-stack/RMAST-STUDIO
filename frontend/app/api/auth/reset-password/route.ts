import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { PasswordReset } from '@/models/index';
import { Admin } from '@/models/Admin';
import { ok, err } from '@/lib/response';

export async function POST(req: NextRequest) {
  try {
    const { token, email, newPassword } = await req.json();
    if (!token || !email || !newPassword) return err('Token, email and new password are required.');
    if (newPassword.length < 6) return err('Password must be at least 6 characters.');
    await connectDB();
    const record = await PasswordReset.findOne({ token, email, expiresAt: { $gt: new Date() } });
    if (!record) return err('Invalid or expired reset token.', 401);
    const admin = await Admin.findOne({ email });
    if (!admin) return err('Admin not found.', 404);
    admin.password = newPassword;
    await admin.save();
    await PasswordReset.deleteOne({ _id: record._id });
    return ok(null, 'Password reset successful. Please login.');
  } catch { return err('Server error.', 500); }
}