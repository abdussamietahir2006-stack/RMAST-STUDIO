import { NextRequest } from 'next/server';
import { authenticate } from '@/lib/auth';
import { ok, err } from '@/lib/response';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  if (!authenticate(req)) return err('Unauthorized.', 401);
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File | null;
    if (!file) return err('No image file provided.');

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'rmast', resource_type: 'image', transformation: [{ quality: 'auto', fetch_format: 'auto' }] },
        (error, result) => {
          if (error || !result) reject(error ?? new Error('Upload failed'));
          else resolve(result as { secure_url: string; public_id: string });
        }
      );
      stream.end(buffer);
    });

    return ok({ url: result.secure_url, publicId: result.public_id }, 'Image uploaded.');
  } catch { return err('Image upload failed.', 500); }
}