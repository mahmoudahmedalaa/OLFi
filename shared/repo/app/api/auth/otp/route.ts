import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signToken, tokenCookieOptions, DEMO_OTP } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { phone, code } = await req.json();

    if (!phone || !code) {
      return NextResponse.json({ error: 'Phone and code required' }, { status: 400 });
    }

    const normalized = phone.replace(/\s+/g, '').replace(/^00/, '+');

    const user = await prisma.user.findUnique({ where: { phone: normalized } });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Accept DEMO_OTP for any user, or the stored OTP if it hasn't expired
    const isDemo = code === DEMO_OTP;
    const isValid =
      isDemo ||
      (user.otpCode === code && user.otpExpiry && user.otpExpiry > new Date());

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid or expired code' }, { status: 401 });
    }

    // Clear OTP after use
    await prisma.user.update({
      where: { id: user.id },
      data: { otpCode: null, otpExpiry: null },
    });

    const token = await signToken(user.id);
    const res = NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, phone: user.phone, email: user.email, kycStatus: user.kycStatus, lang: user.lang },
    });
    res.cookies.set(tokenCookieOptions(token));
    return res;
  } catch (err) {
    console.error('[otp]', err);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
