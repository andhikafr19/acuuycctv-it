import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

const BUCKET = 'certificates';
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
]);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: 'File gambar tidak ditemukan.' },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Format file harus berupa gambar (JPG, PNG, WEBP, atau GIF).' },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: 'Ukuran gambar maksimal 5 MB.' },
        { status: 400 }
      );
    }

    const sb = getSupabaseAdmin();

    // Pastikan bucket publik tersedia
    const { error: bucketErr } = await sb.storage.getBucket(BUCKET);
    if (bucketErr) {
      const { error: createErr } = await sb.storage.createBucket(BUCKET, {
        public: true,
        fileSizeLimit: MAX_SIZE_BYTES,
      });
      if (createErr && !createErr.message.toLowerCase().includes('already exists')) {
        throw createErr;
      }
    }

    const ext = (file.name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '');
    const safeName = file.name
      .replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
      .slice(0, 40);
    const filePath = `cert-${Date.now()}-${safeName || 'image'}.${ext || 'png'}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadErr } = await sb.storage
      .from(BUCKET)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadErr) {
      throw uploadErr;
    }

    const { data: publicUrlData } = sb.storage.from(BUCKET).getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
      path: filePath,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal mengunggah gambar.' },
      { status: 500 }
    );
  }
}

