import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Admin } from '@/models/Admin';
import { PasswordReset } from '@/models/index';
import { ok, err } from '@/lib/response';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return err('Email is required.');
    await connectDB();
    const admin = await Admin.findOne({ email });
    if (!admin) return ok(null, 'If this email exists, a reset link has been sent.');

    await PasswordReset.deleteMany({ email });
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await PasswordReset.create({ email, token, expiresAt });

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/admin/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
    console.log(`\n🔗 Reset link:\n${resetLink}\n`);

    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      try {
        const nodemailer = require('nodemailer');
        const t = nodemailer.createTransport({
          host: process.env.SMTP_HOST, port: parseInt(process.env.SMTP_PORT || '587'),
          secure: false, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
        });
        await t.sendMail({
          from: process.env.SMTP_FROM || 'noreply@rmast.dev', to: email,
          subject: 'Reset Your RMAST Admin Password',
          html: `<p>Click <a href="${resetLink}">here</a> to reset your password. Expires in 1 hour.</p>`,
        });
      } catch (e) { console.error('Email error:', e); }
    }

    return ok({ resetToken: token }, 'If this email exists, a reset link has been sent.');
  } catch { return err('Server error.', 500); }
}