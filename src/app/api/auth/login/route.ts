import { NextRequest, NextResponse } from 'next/server';
import { createToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminHash = process.env.ADMIN_PASSWORD_HASH;
    if (!adminHash) {
      return NextResponse.json({ error: 'Admin not configured' }, { status: 500 });
    }

    if (username !== adminUsername) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, adminHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await createToken('admin', username);
    const response = NextResponse.json({ success: true });
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    return response;
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
