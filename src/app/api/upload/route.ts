import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { uploadToR2 } from '@/lib/r2';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    await requireAuth(req);
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const key = `avatars/${randomUUID()}-${file.name}`;
    const url = await uploadToR2(file, key);
    return NextResponse.json({ url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
