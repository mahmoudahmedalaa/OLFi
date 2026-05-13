import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUserId } from '@/lib/auth';

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) return NextResponse.json({ user: null }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, phone: true, email: true, kycStatus: true, lang: true },
  });

  return NextResponse.json({ user });
}

export async function PATCH(req: Request) {
  const userId = await getAuthUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { lang, kycStatus } = await req.json();
  const data: Record<string, string> = {};
  if (lang) data.lang = lang;
  if (kycStatus) data.kycStatus = kycStatus;

  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: { id: true, name: true, phone: true, email: true, kycStatus: true, lang: true },
  });

  return NextResponse.json({ user });
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set({
    name: 'olfi_token',
    value: '',
    maxAge: 0,
    expires: new Date(0),
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  return res;
}
