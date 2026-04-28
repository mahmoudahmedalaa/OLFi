'use client';

import { useState, useEffect } from 'react';
import { B } from '@/lib/brand';
import { NavProps, OfferData } from '@/lib/types';
import { BottomTabs } from '@/components/ui/bottom-tabs';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { TopBar } from '@/components/ui/top-bar';

const DEMO_OFFERS: OfferData[] = [
  { id: 'dib',   bank: 'Dubai Islamic Bank',     type: 'Murābaḥa', apr: 8.2, monthly: 2950, saving: 680, score: 96, approvalDays: 1, tenure: 48, color: '#0A5C38', featured: true  },
  { id: 'adib',  bank: 'Abu Dhabi Islamic Bank', type: 'Tawarruq', apr: 8.5, monthly: 2980, saving: 650, score: 93, approvalDays: 2, tenure: 42, color: '#1B1464', featured: false },
  { id: 'fab_i', bank: 'FAB Islamic',            type: 'Murābaḥa', apr: 9.1, monthly: 3040, saving: 590, score: 88, approvalDays: 3, tenure: 36, color: '#C8102E', featured: false },
  { id: 'emi',   bank: 'Emirates Islamic',       type: 'Ijāra',    apr: 9.4, monthly: 3080, saving: 550, score: 85, approvalDays: 2, tenure: 60, color: '#006940', featured: false },
];

const TYPE_KEYS: Record<string, string> = { 'Murābaḥa': 'murabaha', 'Tawarruq': 'tawarruq', 'Ijāra': 'ijara' };

export function MarketplaceScreen({ navigate, onTab, t }: NavProps) {
  const [filter, setFilter] = useState('all');
  const [offers, setOffers] = useState<OfferData[]>(DEMO_OFFERS);

  useEffect(() => {
    fetch('/api/marketplace').then(r => r.json()).then(d => { if (d.offers?.length) setOffers(d.offers); }).catch(() => {});
  }, []);

  const sorted = [...offers].sort((a, b) => {
    if (filter === 'apr')  return a.apr - b.apr;
    if (filter === 'emi')  return a.monthly - b.monthly;
    if (filter === 'fast') return a.approvalDays - b.approvalDays;
    if (filter === 'term') return a.tenure - b.tenure;
    return b.score - a.score;
  });

  const filters = [
    { id: 'all', label: t.filterAll }, { id: 'apr', label: t.filterAPR },
    { id: 'emi', label: t.filterEMI }, { id: 'fast', label: t.filterFast },
    { id: 'term', label: t.filterTerm },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: B.navy }}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ background: `linear-gradient(160deg, #0a1628 0%, ${B.navyMid} 100%)`, padding: '52px 20px 20px' }}>
          <TopBar title="" onBack={() => navigate('dashboard')} light />
          <div style={{ padding: '0 4px' }}>
            <h2 style={{ color: B.text, fontSize: 22, fontWeight: 800, margin: '0 0 4px' }}>Refinance Offers</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: B.emerald, fontSize: 12, fontWeight: 600 }}>{t.shariaOnly}</span>
              <InfoTooltip id="murabaha" />
            </div>
            <p style={{ color: B.muted, fontSize: 12, margin: '4px 0 0' }}>Matched to OLFI Score 724 · {offers.length} offers</p>
          </div>
        </div>

        <div style={{ padding: 16 }}>
          <div style={{ background: B.navyMid, borderRadius: 14, padding: '14px 18px', marginBottom: 14, border: `1px solid ${B.navyLt}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 11, color: B.muted, margin: '0 0 2px' }}>Best available saving</p>
              <span style={{ fontSize: 22, fontWeight: 900, color: B.emerald }}>AED 680 / month</span>
            </div>
            <div style={{ background: 'rgba(16,185,129,0.15)', borderRadius: 10, padding: '6px 12px' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: B.emerald }}>AED 32,640 total</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 7, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
            {filters.map(f => (
              <div key={f.id} onClick={() => setFilter(f.id)} style={{ flexShrink: 0, padding: '8px 14px', borderRadius: 99, background: filter === f.id ? B.emerald : B.navyMid, color: filter === f.id ? '#fff' : B.muted, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: `1px solid ${filter === f.id ? B.emerald : B.navyLt}`, transition: 'all 0.15s' }}>
                {f.label}
              </div>
            ))}
          </div>

          {sorted.map(o => (
            <div key={o.id} onClick={() => navigate('offer_detail', o)} style={{ background: B.navyMid, borderRadius: 20, padding: 18, marginBottom: 12, border: `1.5px solid ${o.featured && filter === 'all' ? B.emerald : B.navyLt}`, cursor: 'pointer', boxShadow: o.featured && filter === 'all' ? '0 4px 24px rgba(16,185,129,0.15)' : 'none', transition: 'all 0.15s' }}>
              {o.featured && filter === 'all' && (
                <div style={{ background: B.emerald, color: '#fff', fontSize: 10, fontWeight: 800, letterSpacing: 0.8, padding: '3px 10px', borderRadius: 99, display: 'inline-block', marginBottom: 10 }}>{t.bestMatch}</div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 46, height: 46, borderRadius: 14, background: o.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#fff' }}>
                  {o.bank.split(' ')[0].substring(0, 4).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: B.text }}>{o.bank}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
                    <span style={{ background: 'rgba(16,185,129,0.15)', color: B.emerald, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99 }}>✦ {o.type}</span>
                    <InfoTooltip id={TYPE_KEYS[o.type] ?? null} />
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: 20, fontWeight: 900, color: B.emerald }}>{o.apr}%</p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: B.muted }}>{t.profitRate}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {([
                  [t.monthlySaving, `AED ${o.saving}`, B.emerald, 'rgba(16,185,129,0.08)'],
                  [t.newEMI, `AED ${o.monthly}`, B.text, B.navy],
                  [filter === 'fast' ? 'Approval' : filter === 'term' ? 'Tenure' : t.scoreMatch,
                   filter === 'fast' ? `${o.approvalDays}d` : filter === 'term' ? `${o.tenure}mo` : `${o.score}%`,
                   filter === 'fast' ? B.teal : B.text, B.navy],
                ] as [string,string,string,string][]).map(([l, v, c, bg]) => (
                  <div key={l} style={{ flex: 1, background: bg, borderRadius: 10, padding: '10px 12px' }}>
                    <p style={{ margin: 0, fontSize: 10, color: B.dim }}>{l}</p>
                    <p style={{ margin: '3px 0 0', fontSize: 14, fontWeight: 800, color: c }}>{v}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomTabs tab="offers" onTab={id => { onTab(id); if (id === 'home') navigate('dashboard'); if (id === 'score') navigate('score'); if (id === 'profile') navigate('profile'); if (id === 'apps') navigate('applications'); }} t={t} />
    </div>
  );
}
