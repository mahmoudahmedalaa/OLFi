'use client';

import { useState } from 'react';
import { B } from '@/lib/brand';
import { NavProps, OfferData } from '@/lib/types';
import { Btn } from '@/components/ui/btn';
import { TopBar } from '@/components/ui/top-bar';
import { InfoTooltip } from '@/components/ui/info-tooltip';

const TOTAL_EMI = 4630;
const TYPE_KEYS: Record<string, string> = { 'Murābaḥa': 'murabaha', 'Tawarruq': 'tawarruq', 'Ijāra': 'ijara' };

const DEFAULT_OFFER: OfferData = { id: 'dib', bank: 'Dubai Islamic Bank', type: 'Murābaḥa', apr: 8.2, monthly: 2950, saving: 680, score: 96, approvalDays: 1, tenure: 48, color: '#0A5C38', featured: true };

export function OfferDetailScreen({ navigate, onTab, t, extraData }: NavProps & { extraData?: OfferData }) {
  const offer = extraData ?? DEFAULT_OFFER;
  const totalSaving = offer.saving * offer.tenure;
  const [loading, setLoading] = useState(false);

  const apply = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/applications', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offerId: offer.id }),
      });
      if (res.ok) { navigate('apply_status'); } else { navigate('apply_status'); }
    } catch {
      navigate('apply_status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: '100%', background: B.navy, display: 'flex', flexDirection: 'column' }}>
      <TopBar title={offer.bank} onBack={() => navigate('marketplace')} />
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 16px 24px' }}>
        <div style={{ background: offer.color, borderRadius: 20, padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff' }}>
              {offer.bank.split(' ')[0].substring(0, 4).toUpperCase()}
            </div>
            <div>
              <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 800, margin: '0 0 4px' }}>{offer.bank}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99 }}>✦ {offer.type}</span>
                <InfoTooltip id={TYPE_KEYS[offer.type] ?? null} />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {([['Profit Rate', offer.apr + '%'], ['Tenure', offer.tenure + ' mo'], ['Approval', offer.approvalDays + ' day']] as [string,string][]).map(([l, v]) => (
              <div key={l} style={{ flex: 1, background: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: '12px 8px', textAlign: 'center' }}>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 10, margin: '0 0 4px', fontWeight: 600 }}>{l}</p>
                <p style={{ color: '#fff', fontSize: 16, fontWeight: 800, margin: 0 }}>{v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Before vs After */}
        <div style={{ background: B.navyMid, borderRadius: 20, padding: 18, marginBottom: 14, border: `1px solid ${B.navyLt}` }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: B.text, margin: '0 0 14px' }}>Before vs After Refinance</h4>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, background: 'rgba(239,68,68,0.08)', borderRadius: 14, padding: 14, border: '1px solid rgba(239,68,68,0.2)' }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: B.error, margin: '0 0 8px' }}>CURRENT</p>
              <p style={{ fontSize: 10, color: B.dim, margin: '0 0 2px' }}>Monthly EMI</p>
              <p style={{ fontSize: 20, fontWeight: 900, color: B.error, margin: '0 0 8px' }}>AED {TOTAL_EMI.toLocaleString()}</p>
              <p style={{ fontSize: 10, color: B.dim, margin: 0 }}>Interest-based <InfoTooltip id="apr" /></p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke={B.dim} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div style={{ flex: 1, background: 'rgba(16,185,129,0.08)', borderRadius: 14, padding: 14, border: `1px solid rgba(16,185,129,0.3)` }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: B.emerald, margin: '0 0 8px' }}>NEW OFFER</p>
              <p style={{ fontSize: 10, color: B.dim, margin: '0 0 2px' }}>Monthly EMI</p>
              <p style={{ fontSize: 20, fontWeight: 900, color: B.emerald, margin: '0 0 8px' }}>AED {offer.monthly.toLocaleString()}</p>
              <p style={{ fontSize: 10, color: B.dim, margin: 0 }}>☪️ Sharia-certified</p>
            </div>
          </div>
        </div>

        {/* Savings */}
        <div style={{ background: B.navyMid, borderRadius: 20, padding: 18, marginBottom: 14, border: `1px solid ${B.navyLt}` }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: B.text, margin: '0 0 14px' }}>Savings Summary</h4>
          {([['Monthly saving', `AED ${offer.saving.toLocaleString()}`, B.emerald], ['Total saving over term', `AED ${totalSaving.toLocaleString()}`, B.emerald], ['DBR reduction', '~8%', B.teal]] as [string,string,string][]).map(([l, v, c]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${B.navyLt}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 13, color: B.muted }}>{l}</span>
                {l.includes('DBR') && <InfoTooltip id="dbr" />}
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: c }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Sharia cert */}
        <div style={{ background: 'rgba(16,185,129,0.07)', borderRadius: 14, padding: '14px 16px', marginBottom: 16, border: `1px solid rgba(16,185,129,0.2)`, display: 'flex', gap: 12 }}>
          <span style={{ fontSize: 20 }}>☪️</span>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: B.emerald, margin: '0 0 3px' }}>AAOIFI Sharia-Certified</p>
            <p style={{ fontSize: 12, color: B.muted, margin: 0, lineHeight: 1.5 }}>Certified by OLFI's Sharia Advisory Board. No riba involved.</p>
          </div>
        </div>

        <Btn onPress={apply} disabled={loading}>{loading ? 'Submitting…' : `${t.applyNow} — ${offer.bank}`}</Btn>
        <Btn onPress={() => navigate('marketplace')} variant="ghost" style={{ marginTop: 8 }}>Compare other offers</Btn>
      </div>
    </div>
  );
}
