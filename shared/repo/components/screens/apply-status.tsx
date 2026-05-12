'use client';

import { useState, useEffect } from 'react';
import { B } from '@/lib/brand';
import { NavProps } from '@/lib/types';
import { Btn } from '@/components/ui/btn';

const STEPS = [
  { label: 'Application Submitted', sub: 'Received by OLFI platform' },
  { label: 'Identity Verified', sub: 'KYC documents confirmed' },
  { label: 'Under Lender Review', sub: 'Dubai Islamic Bank reviewing profile', active: true },
  { label: 'Offer Accepted', sub: 'Awaiting digital signature' },
  { label: 'Refinance Complete', sub: 'Old debt settled, new contract active' },
];

export function ApplyStatusScreen({ navigate, onTab }: NavProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 800);
    const t2 = setTimeout(() => setStep(2), 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div style={{ height: '100%', background: B.navy, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflow: 'auto', padding: '24px 24px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 28, paddingTop: 16 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: `2px solid ${B.emerald}`, boxShadow: '0 0 0 10px rgba(16,185,129,0.06)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={B.emerald} strokeWidth="2"/><path d="M8 12l3 3 5-5" stroke={B.emerald} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: B.text, margin: '0 0 8px' }}>Application Submitted!</h2>
          <p style={{ color: B.muted, fontSize: 14, margin: 0 }}>Processing with <strong style={{ color: B.text }}>Dubai Islamic Bank</strong></p>
        </div>

        <div style={{ background: B.navyMid, borderRadius: 16, padding: '16px 20px', marginBottom: 16, border: `1px solid ${B.navyLt}`, textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: B.dim, margin: '0 0 4px' }}>Reference</p>
          <p style={{ fontSize: 17, fontWeight: 800, color: B.text, margin: 0, letterSpacing: 1 }}>OLFI-DIB-2026-04912</p>
        </div>

        <div style={{ background: B.navyMid, borderRadius: 20, padding: 20, marginBottom: 16, border: `1px solid ${B.navyLt}` }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: B.text, margin: '0 0 20px' }}>Application Status</h4>
          {STEPS.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, marginBottom: i < STEPS.length - 1 ? 20 : 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, background: i <= step ? B.emerald : B.navy, border: `2px solid ${i <= step ? B.emerald : B.navyLt}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.5s' }}>
                  {i <= step && <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  {s.active && i > step && <div style={{ width: 8, height: 8, borderRadius: '50%', background: B.warn }} />}
                </div>
                {i < STEPS.length - 1 && <div style={{ width: 2, height: 20, background: i < step ? B.emerald : B.navyLt, marginTop: 4, borderRadius: 2, transition: 'background 0.5s' }} />}
              </div>
              <div style={{ paddingTop: 2 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: i <= step ? B.text : B.muted }}>{s.label}</p>
                <p style={{ margin: '3px 0 0', fontSize: 12, color: B.dim }}>{s.sub}</p>
                {s.active && i === step && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 5, background: 'rgba(245,158,11,0.1)', borderRadius: 6, padding: '3px 10px', border: `1px solid rgba(245,158,11,0.2)` }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: B.warn, animation: 'pulse 1.5s infinite' }} />
                    <span style={{ fontSize: 11, color: B.warn, fontWeight: 700 }}>In Progress</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <Btn onPress={() => { onTab('home'); navigate('dashboard'); }}>Back to Dashboard</Btn>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </div>
  );
}
