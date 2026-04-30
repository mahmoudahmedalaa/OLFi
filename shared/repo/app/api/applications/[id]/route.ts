import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUserId } from '@/lib/auth';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const app = await prisma.application.findFirst({
    where: { id, userId },
    include: { payments: { orderBy: { month: 'asc' } } },
  });

  if (!app) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ application: app });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { status, paidMonths } = await req.json();

  const app = await prisma.application.findFirst({ where: { id, userId } });
  if (!app) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const data: Record<string, unknown> = {};
  if (status === 'ACCEPTED') { data.status = 'ACCEPTED'; data.acceptedDate = new Date(); }
  if (status === 'DECLINED') { data.status = 'DECLINED'; data.declinedDate = new Date(); }
  if (typeof paidMonths === 'number') data.paidMonths = paidMonths;

  const updated = await prisma.application.update({
    where: { id },
    data,
    include: { payments: { orderBy: { month: 'asc' } } },
  });

  return NextResponse.json({ application: updated });
}
