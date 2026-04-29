'use client';

import { B } from '@/lib/brand';
import { NavProps } from '@/lib/types';
import { TopBar } from '@/components/ui/top-bar';

const DEBTS = [
  { id: 'pl',   type: 'Personal Loan', bank: 'FAB',         amount: 85000, rate: 14.5, emi: 2340, remaining: 42, color: '#C8102E' },
  { id: 'cc',   type: 'Credit Card',   bank: 'Emirates NBD', amount: 23400, rate: 22.8, emi: 1170, remaining: 18, color: '#E5A000' },
  { id: 'auto', type: 'Auto Loan',     bank: 'ADCB',         amount: 42000, rate: 8.9,  emi: 1120, remaining: 36, color: '#E31837' },
];
const TOTAL_DEBT = DEBTS.reduce((s, d) => s + d.amount, 0);
const TOTAL_EMI  = DEBTS.reduce((s, d) => s + d.emi, 0);

export function DebtDetailScreen({ navigate, t }: NavProps) {
  return (
    <div style={{ height: '100%', background: B.navy, display: 'flex', flexDirection: 'column' }}>
      <TopBar title={t.liabilities} onBack={() => navigate('dashboard')} />
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 16px 24px' }}>
        <div style={{ background: B.grad, borderRadius: 20, padding: 20, marginBottom: 20 }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: '0 0 4px' }}>Total Outstanding</p>
          <p style={{ color: '#fff', fontSize: 32, fontWeight: 900, margin: '0 0 16px', letterSpacing: -0.5 }}>AED {TOTAL_DEBT.toLocaleString()}</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {([['3', 'Active Debts'], [`AED ${TOTAL_EMI.toLocaleString()}`, 'Monthly EMI'], ['14.5%', 'Avg Rate']] as [string,string][]).map(([v, l]) => (
              <div key={l} style={{ flex: 1, background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
                <p style={{ color: '#fff', fontSize: 15, fontWeight: 800, margin: '0 0 2px' }}>{v}</p>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 10, margin: 0 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>

        {DEBTS.map(d => (
          <div key={d.id} style={{ background: B.navyMid, borderRadius: 18, padding: 18, marginBottom: 12, border: `1px solid ${B.navyLt}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: d.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff' }}>
                {d.bank.split(' ')[0].substring(0, 4).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: B.text }}>{d.bank}</p>
                <p style={{ margin: '2px 0 0', fontSize: 13, color: B.muted }}>{d.type}</p>
              </div>
              <div style={{ background: 'rgba(239,68,68,0.15)', borderRadius: 8, padding: '4px 10px' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: B.error }}>Interest-based</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
              {([['Outstanding', `AED ${d.amount.toLocaleString()}`], ['Annual Rate', `${d.rate}%`], ['Monthly EMI', `AED ${d.emi.toLocaleString()}`], ['Remaining', `${d.remaining} months`]] as [string,string][]).map(([l, v]) => (
                <div key={l} style={{ background: B.navy, borderRadius: 10, padding: '10px 12px' }}>
                  <p style={{ margin: 0, fontSize: 11, color: B.dim }}>{l}</p>
                  <p style={{ margin: '3px 0 0', fontSize: 14, fontWeight: 700, color: B.text }}>{v}</p>
                </div>
              ))}
            </div>
            <div onClick={() => navigate('marketplace')} style={{ background: 'rgba(16,185,129,0.1)', borderRadius: 10, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', border: `1px solid rgba(16,185,129,0.2)` }}>
              <span style={{ fontSize: 13, color: B.emerald, fontWeight: 600 }}>Refinance this →</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: B.emerald }}>
                {d.id === 'pl' ? 'Save AED 680/mo' : d.id === 'cc' ? 'Save AED 290/mo' : 'Save AED 180/mo'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
