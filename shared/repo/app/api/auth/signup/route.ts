import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DEMO_OTP } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email } = await req.json();

    if (!name || !phone || !email) {
      return NextResponse.json({ error: 'Name, phone and email are required' }, { status: 400 });
    }

    const normalizedPhone = phone.replace(/\s+/g, '').replace(/^00/, '+');

    // Upsert user (allow re-signup for demo)
    const user = await prisma.user.upsert({
      where: { phone: normalizedPhone },
      update: { name, email, otpCode: DEMO_OTP, otpExpiry: new Date(Date.now() + 10 * 60_000) },
      create: {
        name,
        phone: normalizedPhone,
        email,
        otpCode: DEMO_OTP,
        otpExpiry: new Date(Date.now() + 10 * 60_000),
      },
    });

    // Seed score if not present
    await prisma.olfiScore.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id },
    });

    // In production: send real OTP via SMS. For demo we skip.
    return NextResponse.json({ success: true, phone: normalizedPhone });
  } catch (err) {
    console.error('[signup]', err);
    return NextResponse.json({ error: 'Signup failed' }, { status: 500 });
  }
}
