import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding OLFI database…');

  // Seed marketplace offers
  const offerData = [
    { bank: 'Dubai Islamic Bank',     type: 'Murābaḥa', apr: 8.2, monthly: 2950, saving: 680, score: 96, approvalDays: 1, tenure: 48, color: '#0A5C38', featured: true  },
    { bank: 'Abu Dhabi Islamic Bank', type: 'Tawarruq', apr: 8.5, monthly: 2980, saving: 650, score: 93, approvalDays: 2, tenure: 42, color: '#1B1464', featured: false },
    { bank: 'FAB Islamic',            type: 'Murābaḥa', apr: 9.1, monthly: 3040, saving: 590, score: 88, approvalDays: 3, tenure: 36, color: '#C8102E', featured: false },
    { bank: 'Emirates Islamic',       type: 'Ijāra',    apr: 9.4, monthly: 3080, saving: 550, score: 85, approvalDays: 2, tenure: 60, color: '#006940', featured: false },
  ];

  for (const o of offerData) {
    await prisma.offer.upsert({
      where: { id: `seed-${o.bank.toLowerCase().replace(/\s+/g, '-')}` },
      update: o,
      create: { id: `seed-${o.bank.toLowerCase().replace(/\s+/g, '-')}`, ...o },
    });
  }

  // Seed demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'ahmed.hassan@demo.olfi.ae' },
    update: {},
    create: {
      name: 'Ahmed Hassan',
      phone: '+971501234567',
      email: 'ahmed.hassan@demo.olfi.ae',
      kycStatus: 'PARTIAL',
      lang: 'en',
    },
  });

  // Seed debts for demo user
  const debtData = [
    { type: 'Personal Loan', bank: 'FAB',         amount: 85000, rate: 14.5, emi: 2340, remaining: 42, color: '#C8102E' },
    { type: 'Credit Card',   bank: 'Emirates NBD', amount: 23400, rate: 22.8, emi: 1170, remaining: 18, color: '#E5A000' },
    { type: 'Auto Loan',     bank: 'ADCB',         amount: 42000, rate: 8.9,  emi: 1120, remaining: 36, color: '#E31837' },
  ];

  const existingDebts = await prisma.debt.count({ where: { userId: demoUser.id } });
  if (existingDebts === 0) {
    await prisma.debt.createMany({ data: debtData.map(d => ({ ...d, userId: demoUser.id })) });
  }

  // Seed OLFI score
  await prisma.olfiScore.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      userId: demoUser.id,
      olfiScore: 724, cbuaeScore: 718,
      loanRepayment: 88, creditCard: 72, billPayments: 90,
      cashFlow: 68, employment: 95, spending: 74, dbr: 61,
    },
  });

  // Seed demo applications
  const dibOffer = await prisma.offer.findFirst({ where: { bank: 'Dubai Islamic Bank' } });
  const adibOffer = await prisma.offer.findFirst({ where: { bank: 'Abu Dhabi Islamic Bank' } });
  const fabOffer = await prisma.offer.findFirst({ where: { bank: 'FAB Islamic' } });

  if (dibOffer) {
    const app = await prisma.application.upsert({
      where: { ref: 'OLFI-DIB-2026-04912' },
      update: {},
      create: {
        userId: demoUser.id, offerId: dibOffer.id,
        bank: 'Dubai Islamic Bank', type: 'Murābaḥa', color: '#0A5C38',
        status: 'ACCEPTED', ref: 'OLFI-DIB-2026-04912',
        amount: 150400, newEmi: 2950, saving: 680, apr: 8.2, tenure: 48,
        appliedDate: new Date('2026-04-18'), acceptedDate: new Date('2026-04-20'),
        paidMonths: 1,
        nextPayment: new Date('2026-05-20'), nextAmount: 2950,
      },
    });
    // Seed payment schedule
    const paymentCount = await prisma.payment.count({ where: { applicationId: app.id } });
    if (paymentCount === 0) {
      await prisma.payment.createMany({
        data: [
          { applicationId: app.id, month: 'May 2026', amount: 2950, principal: 1900, profit: 1050, balance: 148500, status: 'UPCOMING' },
          { applicationId: app.id, month: 'Jun 2026', amount: 2950, principal: 1913, profit: 1037, balance: 146587, status: 'UPCOMING' },
          { applicationId: app.id, month: 'Jul 2026', amount: 2950, principal: 1926, profit: 1024, balance: 144661, status: 'UPCOMING' },
        ],
      });
    }
  }

  if (adibOffer) {
    await prisma.application.upsert({
      where: { ref: 'OLFI-ADIB-2026-04913' },
      update: {},
      create: {
        userId: demoUser.id, offerId: adibOffer.id,
        bank: 'Abu Dhabi Islamic Bank', type: 'Tawarruq', color: '#1B1464',
        status: 'PENDING', ref: 'OLFI-ADIB-2026-04913',
        amount: 150400, newEmi: 2980, saving: 650, apr: 8.5, tenure: 42,
        appliedDate: new Date('2026-04-21'),
      },
    });
  }

  if (fabOffer) {
    await prisma.application.upsert({
      where: { ref: 'OLFI-FAB-2026-04890' },
      update: {},
      create: {
        userId: demoUser.id, offerId: fabOffer.id,
        bank: 'FAB Islamic', type: 'Murābaḥa', color: '#C8102E',
        status: 'DECLINED', ref: 'OLFI-FAB-2026-04890',
        amount: 150400, newEmi: 3040, saving: 590, apr: 9.1, tenure: 36,
        appliedDate: new Date('2026-04-10'), declinedDate: new Date('2026-04-14'),
        declineReason: 'DBR exceeds 50% threshold at time of application.',
      },
    });
  }

  console.log('✅ Seed complete');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
