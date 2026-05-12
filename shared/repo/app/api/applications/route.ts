import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUserId } from '@/lib/auth';

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const apps = await prisma.application.findMany({
    where: { userId },
    include: { payments: { orderBy: { month: 'asc' } } },
    orderBy: { appliedDate: 'desc' },
  });

  return NextResponse.json({ applications: apps });
}

export async function POST(req: NextRequest) {
  const userId = await getAuthUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { offerId } = await req.json();
  if (!offerId) return NextResponse.json({ error: 'offerId required' }, { status: 400 });

  const offer = await prisma.offer.findUnique({ where: { id: offerId } });
  if (!offer) return NextResponse.json({ error: 'Offer not found' }, { status: 404 });

  // Get user's total debt for amount
  const debts = await prisma.debt.findMany({ where: { userId } });
  const totalDebt = debts.reduce((s, d) => s + d.amount, 0) || 150400;

  const ref = `OLFI-${offer.bank.split(' ')[0].toUpperCase()}-${Date.now().toString().slice(-8)}`;

  const app = await prisma.application.create({
    data: {
      userId,
      offerId,
      bank: offer.bank,
      type: offer.type,
      color: offer.color,
      status: 'PENDING',
      ref,
      amount: totalDebt,
      newEmi: offer.monthly,
      saving: offer.saving,
      apr: offer.apr,
      tenure: offer.tenure,
      nextPayment: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      nextAmount: offer.monthly,
    },
  });

  return NextResponse.json({ application: app }, { status: 201 });
}
