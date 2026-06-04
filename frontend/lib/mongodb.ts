import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error('Missing MONGODB_URI in .env.local');

interface Cache { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null; }
declare global { var _mongoose: Cache; }

const cached: Cache = global._mongoose || { conn: null, promise: null };
global._mongoose = cached;

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { dbName: 'rmaststudio3' });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}