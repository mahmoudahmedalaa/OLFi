import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUserId } from '@/lib/auth';

const SEED_OFFERS = [
  { bank: 'Dubai Islamic Bank',      type: 'Murābaḥa', apr: 8.2, monthly: 2950, saving: 680, score: 96, approvalDays: 1, tenure: 48, color: '#0A5C38', featured: true },
  { bank: 'Abu Dhabi Islamic Bank',  type: 'Tawarruq', apr: 8.5, monthly: 2980, saving: 650, score: 93, approvalDays: 2, tenure: 42, color: '#1B1464', featured: false },
  { bank: 'FAB Islamic',             type: 'Murābaḥa', apr: 9.1, monthly: 3040, saving: 590, score: 88, approvalDays: 3, tenure: 36, color: '#C8102E', featured: false },
  { bank: 'Emirates Islamic',        type: 'Ijāra',    apr: 9.4, monthly: 3080, saving: 550, score: 85, approvalDays: 2, tenure: 60, color: '#006940', featured: false },
];

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let offers = await prisma.offer.findMany({ orderBy: { score: 'desc' } });

  if (offers.length === 0) {
    await prisma.offer.createMany({ data: SEED_OFFERS });
    offers = await prisma.offer.findMany({ orderBy: { score: 'desc' } });
  }

  return NextResponse.json({ offers });
}
