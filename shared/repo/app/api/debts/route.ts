import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUserId } from '@/lib/auth';

const DEMO_DEBTS = [
  { type: 'Personal Loan', bank: 'FAB', amount: 85000, rate: 14.5, emi: 2340, remaining: 42, color: '#C8102E' },
  { type: 'Credit Card',   bank: 'Emirates NBD', amount: 23400, rate: 22.8, emi: 1170, remaining: 18, color: '#E5A000' },
  { type: 'Auto Loan',     bank: 'ADCB', amount: 42000, rate: 8.9,  emi: 1120, remaining: 36, color: '#E31837' },
];

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let debts = await prisma.debt.findMany({ where: { userId }, orderBy: { amount: 'desc' } });

  // Seed demo debts if none exist
  if (debts.length === 0) {
    await prisma.debt.createMany({
      data: DEMO_DEBTS.map(d => ({ ...d, userId })),
    });
    debts = await prisma.debt.findMany({ where: { userId }, orderBy: { amount: 'desc' } });
  }

  return NextResponse.json({ debts });
}
