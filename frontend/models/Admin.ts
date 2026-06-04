import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdmin extends Document {
  email: string; password: string; role: string;
  comparePassword(p: string): Promise<boolean>;
}

const S = new Schema<IAdmin>(
  { email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' } },
  { timestamps: true }
);

S.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

S.methods.comparePassword = async function (p: string) {
  return bcrypt.compare(p, this.password);
};

export const Admin = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', S);