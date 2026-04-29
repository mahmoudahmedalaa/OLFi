import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUserId } from '@/lib/auth';

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let score = await prisma.olfiScore.findUnique({ where: { userId } });

  if (!score) {
    score = await prisma.olfiScore.create({ data: { userId } });
  }

  return NextResponse.json({ score });
}
