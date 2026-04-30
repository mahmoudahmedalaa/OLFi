'use client';

import { useState, useEffect } from 'react';
import { B } from '@/lib/brand';
import { NavProps, DebtData } from '@/lib/types';
import { BottomTabs } from '@/components/ui/bottom-tabs';
import { InfoTooltip } from '@/components/ui/info-tooltip';

const DEMO_DEBTS: DebtData[] = [
  { id: 'pl',   type: 'Personal Loan', bank: 'FAB',         amount: 85000, rate: 14.5, emi: 2340, remaining: 42, color: '#C8102E' },
  { id: 'cc',   type: 'Credit Card',   bank: 'Emirates NBD', amount: 23400, rate: 22.8, emi: 1170, remaining: 18, color: '#E5A000' },
  { id: 'auto', type: 'Auto Loan',     bank: 'ADCB',         amount: 42000, rate: 8.9,  emi: 1120, remaining: 36, color: '#E31837' },
];

export function DashboardScreen({ navigate, onTab, t, user }: NavProps) {
  const [flipped, setFlipped] = useState(false);
  const [scoreAnim, setScoreAnim] = useState(0);
  const [debts, setDebts] = useState<DebtData[]>(DEMO_DEBTS);

  useEffect(() => {
    setTimeout(() => setScoreAnim(724), 400);
    fetch('/api/debts').then(r => r.json()).then(d => { if (d.debts?.length) setDebts(d.debts); }).catch(() => {});
  }, []);

  const totalDebt = debts.reduce((s, d) => s + d.amount, 0);
  const totalEMI  = debts.reduce((s, d) => s + d.emi, 0);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: B.navy }}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Header */}
        <div style={{ background: `linear-gradient(160deg, #0a1628 0%, ${B.navyMid} 100%)`, padding: '56px 20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src="/olfi_logo.png" alt="" style={{ width: 32, height: 32, borderRadius: 8 }} />
              <div>
                <p style={{ color: B.muted, fontSize: 12, margin: 0 }}>{t.goodMorning}</p>
                <h2 style={{ color: B.text, fontSize: 18, fontWeight: 800, margin: 0 }}>{user?.name ?? 'Ahmed Hassan'} 👋</h2>
              </div>
            </div>
            <div style={{ position: 'relative', width: 40, height: 40, borderRadius: 12, background: B.navyLt, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke={B.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <div style={{ position: 'absolute', top: -2, right: -2, width: 10, height: 10, borderRadius: '50%', background: B.error, border: `2px solid ${B.navyMid}` }} />
            </div>
          </div>

          {/* Flip score card */}
          <div onClick={() => setFlipped(f => !f)} style={{ cursor: 'pointer', perspective: 600 }}>
            <div style={{ position: 'relative', transition: 'transform 0.6s', transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)', minHeight: 130 }}>
              {/* Front: OLFI Score */}
              <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(20,184,166,0.1))', borderRadius: 20, padding: '16px 20px', border: '1px solid rgba(16,185,129,0.25)', backfaceVisibility: 'hidden', position: 'absolute', inset: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <p style={{ color: B.muted, fontSize: 11, margin: 0, fontWeight: 700, letterSpacing: 0.8 }}>OLFI SCORE</p>
                    <InfoTooltip id="olfiScore" />
                  </div>
                  <span style={{ fontSize: 11, color: B.dim, background: B.navyLt, padding: '2px 8px', borderRadius: 6 }}>Tap to see CBUAE →</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 }}>
                  <div>
                    <span style={{ color: B.text, fontSize: 48, fontWeight: 900, letterSpacing: -2 }}>{scoreAnim}</span>
                    <span style={{ color: B.muted, fontSize: 14, marginLeft: 4 }}>/850</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ background: 'rgba(16,185,129,0.2)', color: B.emerald, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, marginBottom: 4 }}>GOOD</div>
                    <p style={{ color: B.muted, fontSize: 11, margin: 0 }}>↑ +12 this month</p>
                  </div>
                </div>
                <div style={{ background: B.navyLt, borderRadius: 99, height: 5, overflow: 'hidden' }}>
                  <div style={{ width: `${(scoreAnim / 850) * 100}%`, background: B.grad, height: '100%', borderRadius: 99, transition: 'width 1.2s ease' }} />
                </div>
              </div>
              {/* Back: CBUAE Score */}
              <div style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(99,102,241,0.08))', borderRadius: 20, padding: '16px 20px', border: '1px solid rgba(59,130,246,0.25)', backfaceVisibility: 'hidden', position: 'absolute', inset: 0, transform: 'rotateY(180deg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <p style={{ color: B.muted, fontSize: 11, margin: 0, fontWeight: 700, letterSpacing: 0.8 }}>CBUAE / AECB SCORE</p>
                    <InfoTooltip id="cbuaeScore" />
                  </div>
                  <span style={{ fontSize: 11, color: B.dim, background: B.navyLt, padding: '2px 8px', borderRadius: 6 }}>← Tap for OLFI</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 }}>
                  <div>
                    <span style={{ color: B.text, fontSize: 48, fontWeight: 900, letterSpacing: -2 }}>718</span>
                    <span style={{ color: B.muted, fontSize: 14, marginLeft: 4 }}>/900</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ background: 'rgba(59,130,246,0.2)', color: B.blue, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, marginBottom: 4 }}>GOOD</div>
                    <p style={{ color: B.muted, fontSize: 11, margin: 0 }}>Free via OLFI</p>
                  </div>
                </div>
                <div style={{ background: B.navyLt, borderRadius: 99, height: 5, overflow: 'hidden' }}>
                  <div style={{ width: `${(718 / 900) * 100}%`, background: 'linear-gradient(90deg,#3B82F6,#6366F1)', height: '100%', borderRadius: 99 }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Totals */}
          <div style={{ background: B.navyMid, borderRadius: 20, padding: '18px 20px', border: `1px solid ${B.navyLt}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: B.text, margin: 0 }}>Total Debt Overview</h3>
              <span onClick={() => navigate('debt_detail')} style={{ fontSize: 11, color: B.emerald, fontWeight: 700, cursor: 'pointer' }}>{t.viewAll}</span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {([['TOTAL OWED', `AED ${totalDebt.toLocaleString()}`, B.error], ['MONTHLY EMI', `AED ${totalEMI.toLocaleString()}`, B.text]] as [string,string,string][]).map(([l, v, c]) => (
                <div key={l} style={{ flex: 1, background: B.navy, borderRadius: 12, padding: '12px 14px' }}>
                  <p style={{ fontSize: 10, color: B.muted, margin: '0 0 4px', fontWeight: 600 }}>{l}</p>
                  <p style={{ fontSize: 18, fontWeight: 900, color: c, margin: 0 }}>{v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Refinance opportunity */}
          <div onClick={() => { onTab('offers'); navigate('marketplace'); }} style={{ background: B.grad, borderRadius: 20, padding: '18px 20px', cursor: 'pointer', boxShadow: '0 4px 24px rgba(16,185,129,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 6, padding: '2px 8px', display: 'inline-block', marginBottom: 6 }}>
                  <span style={{ color: '#fff', fontSize: 10, fontWeight: 800, letterSpacing: 0.8 }}>✦ SHARIA-COMPLIANT</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, margin: '0 0 3px' }}>{t.opportunities}</p>
                <h3 style={{ color: '#fff', fontSize: 22, fontWeight: 900, margin: 0 }}>{t.savePer} 680{t.perMonth}</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, margin: '4px 0 0' }}>
                  via Dubai Islamic Bank — Murābaḥa <InfoTooltip id="murabaha" />
                </p>
              </div>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          </div>

          {/* Debts */}
          <h3 style={{ fontSize: 14, fontWeight: 700, color: B.text, margin: '4px 0 -4px' }}>{t.liabilities}</h3>
          {debts.map(d => (
            <div key={d.id} onClick={() => navigate('debt_detail')} style={{ background: B.navyMid, borderRadius: 18, padding: '16px 18px', border: `1px solid ${B.navyLt}`, cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: d.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#fff' }}>
                  {d.bank.split(' ')[0].substring(0, 4).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: B.text }}>{d.type}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: B.muted }}>{d.bank}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: B.text }}>AED {d.amount.toLocaleString()}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: B.error }}>{d.rate}% <InfoTooltip id="apr" /></p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {([['EMI', `AED ${d.emi.toLocaleString()}`], ['Months Left', `${d.remaining} mo`], ['Type', 'Interest']] as [string,string][]).map(([l, v], i) => (
                  <div key={l} style={{ flex: 1, background: B.navy, borderRadius: 8, padding: '8px 10px' }}>
                    <p style={{ margin: 0, fontSize: 10, color: B.dim }}>{l}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 13, fontWeight: 700, color: i === 2 ? B.error : B.text }}>{v}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomTabs tab="home" onTab={id => { onTab(id); if (id === 'offers') navigate('marketplace'); if (id === 'score') navigate('score'); if (id === 'profile') navigate('profile'); if (id === 'apps') navigate('applications'); }} t={t} />
    </div>
  );
}
