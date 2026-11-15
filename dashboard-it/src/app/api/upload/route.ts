import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-server';
import { verifyRequestAuth, verifyCsrfOrigin } from '@/lib/auth';

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

function hasValidImageMagicBytes(buf: Buffer): boolean {
  if (buf.length < 12) return false;
  // JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return true;
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47
  )
    return true;
  // GIF: 47 49 46 38
  if (
    buf[0] === 0x47 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x38
  )
    return true;
  // WEBP: RIFF....WEBP
  if (
    buf[0] === 0x52 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x46 &&
    buf[8] === 0x57 &&
    buf[9] === 0x45 &&
    buf[10] === 0x42 &&
    buf[11] === 0x50
  )
    return true;
  return false;
}

export async function POST(request: Request) {
  try {
    if (!verifyCsrfOrigin(request)) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Origin tidak valid.' },
        { status: 403 }
      );
    }

    const auth = await verifyRequestAuth(request);
    if (!auth) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Silakan login terlebih dahulu.' },
        { status: 401 }
      );
    }

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

    if (!hasValidImageMagicBytes(buffer)) {
      return NextResponse.json(
        { success: false, error: 'Isi file tidak valid atau bukan gambar asli.' },
        { status: 400 }
      );
    }

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

