'use client';

import { useState, useEffect } from 'react';
import { B } from '@/lib/brand';
import { NavProps, ApplicationData } from '@/lib/types';
import { BottomTabs } from '@/components/ui/bottom-tabs';

const DEMO_APPS: ApplicationData[] = [
  {
    id: 'app1', bank: 'Dubai Islamic Bank', type: 'Murābaḥa', color: '#0A5C38',
    status: 'ACCEPTED', ref: 'OLFI-DIB-2026-04912', appliedDate: '18 Apr 2026', acceptedDate: '20 Apr 2026',
    amount: 150400, newEmi: 2950, saving: 680, apr: 8.2, tenure: 48,
    paidMonths: 1, totalMonths: 48, nextPayment: '20 May 2026', nextAmount: 2950,
  },
  {
    id: 'app2', bank: 'Abu Dhabi Islamic Bank', type: 'Tawarruq', color: '#1B1464',
    status: 'PENDING', ref: 'OLFI-ADIB-2026-04913', appliedDate: '21 Apr 2026',
    amount: 150400, newEmi: 2980, saving: 650, apr: 8.5, tenure: 42,
    paidMonths: 0, totalMonths: 42,
  },
  {
    id: 'app3', bank: 'FAB Islamic', type: 'Murābaḥa', color: '#C8102E',
    status: 'DECLINED', ref: 'OLFI-FAB-2026-04890', appliedDate: '10 Apr 2026', declinedDate: '14 Apr 2026',
    declineReason: 'DBR exceeds 50% threshold at time of application.',
    amount: 150400, newEmi: 3040, saving: 590, apr: 9.1, tenure: 36,
    paidMonths: 0, totalMonths: 36,
  },
];

const STATUS_COLORS = { ACCEPTED: '#10B981', PENDING: '#F59E0B', DECLINED: '#EF4444' };
const STATUS_LABELS = { ACCEPTED: '✓ Accepted', PENDING: '⏳ Under Review', DECLINED: '✗ Declined' };

export function ApplicationsScreen({ navigate, onTab, t }: NavProps) {
  const [filter, setFilter] = useState('all');
  const [apps, setApps] = useState<ApplicationData[]>(DEMO_APPS);

  useEffect(() => {
    fetch('/api/applications').then(r => r.json()).then(d => {
      if (d.applications?.length) {
        setApps(d.applications.map((a: ApplicationData) => ({ ...a, totalMonths: a.tenure })));
      }
    }).catch(() => {});
  }, []);

  const filtered = filter === 'all' ? apps : apps.filter(a => a.status.toLowerCase() === filter);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: B.navy }}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ background: `linear-gradient(160deg, #0a1628, ${B.navyMid})`, padding: '52px 20px 20px' }}>
          <h2 style={{ color: B.text, fontSize: 22, fontWeight: 800, margin: '0 0 4px' }}>My Applications</h2>
          <p style={{ color: B.muted, fontSize: 13, margin: 0 }}>Track every refinance you&apos;ve applied for</p>
        </div>

        <div style={{ padding: 16 }}>
          {/* Summary pills */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {([['all','All',apps.length],['accepted','Accepted',apps.filter(a=>a.status==='ACCEPTED').length],['pending','Pending',apps.filter(a=>a.status==='PENDING').length],['declined','Declined',apps.filter(a=>a.status==='DECLINED').length]] as [string,string,number][]).map(([id,label,count]) => (
              <div key={id} onClick={() => setFilter(id)} style={{ flex:1, padding:'8px 6px', borderRadius:12, background: filter===id?B.emerald:B.navyMid, border:`1px solid ${filter===id?B.emerald:B.navyLt}`, textAlign:'center', cursor:'pointer', transition:'all 0.15s' }}>
                <div style={{ fontSize:16, fontWeight:900, color: filter===id?'#fff':B.text }}>{count}</div>
                <div style={{ fontSize:10, fontWeight:600, color: filter===id?'rgba(255,255,255,0.8)':B.dim }}>{label}</div>
              </div>
            ))}
          </div>

          {filtered.map(app => (
            <div key={app.id} onClick={() => app.status !== 'DECLINED' && navigate('app_detail', app)} style={{ background:B.navyMid, borderRadius:20, padding:18, marginBottom:12, border:`1.5px solid ${app.status==='ACCEPTED'?'rgba(16,185,129,0.3)':B.navyLt}`, cursor:app.status==='DECLINED'?'default':'pointer', boxShadow:app.status==='ACCEPTED'?'0 4px 20px rgba(16,185,129,0.1)':'none' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                <div style={{ width:44, height:44, borderRadius:13, background:app.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, color:'#fff' }}>
                  {app.bank.split(' ')[0].substring(0,4).toUpperCase()}
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ margin:0, fontSize:14, fontWeight:700, color:B.text }}>{app.bank}</p>
                  <span style={{ background:'rgba(16,185,129,0.12)', color:B.emerald, fontSize:11, fontWeight:700, padding:'1px 7px', borderRadius:99, marginTop:3, display:'inline-block' }}>✦ {app.type}</span>
                </div>
                <div style={{ background:`rgba(${app.status==='ACCEPTED'?'16,185,129':app.status==='PENDING'?'245,158,11':'239,68,68'},0.12)`, borderRadius:8, padding:'4px 10px' }}>
                  <span style={{ fontSize:11, fontWeight:700, color:STATUS_COLORS[app.status] }}>{STATUS_LABELS[app.status]}</span>
                </div>
              </div>

              <div style={{ display:'flex', gap:8, marginBottom:12 }}>
                {([['APR', app.apr+'%'], ['New EMI', 'AED '+app.newEmi], ['Saving', 'AED '+app.saving+'/mo']] as [string,string][]).map(([l,v]) => (
                  <div key={l} style={{ flex:1, background:B.navy, borderRadius:10, padding:'9px 10px' }}>
                    <p style={{ margin:0, fontSize:10, color:B.dim }}>{l}</p>
                    <p style={{ margin:'2px 0 0', fontSize:13, fontWeight:700, color:B.text }}>{v}</p>
                  </div>
                ))}
              </div>

              {app.status==='ACCEPTED' && (
                <div style={{ background:'rgba(16,185,129,0.08)', borderRadius:12, padding:'10px 14px', border:'1px solid rgba(16,185,129,0.2)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                    <span style={{ fontSize:12, color:B.muted }}>Repayment Progress</span>
                    <span style={{ fontSize:12, fontWeight:700, color:B.emerald }}>{app.paidMonths}/{app.totalMonths} months</span>
                  </div>
                  <div style={{ background:B.navyLt, borderRadius:99, height:5 }}>
                    <div style={{ width:`${(app.paidMonths/(app.totalMonths||1))*100}%`, background:B.grad, height:'100%', borderRadius:99 }} />
                  </div>
                  <p style={{ fontSize:11, color:B.muted, margin:'6px 0 0' }}>Next: AED {app.nextAmount?.toLocaleString()} due {app.nextPayment}</p>
                </div>
              )}
              {app.status==='PENDING' && (
                <div style={{ background:'rgba(245,158,11,0.08)', borderRadius:12, padding:'10px 14px', border:'1px solid rgba(245,158,11,0.2)', display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:B.warn, flexShrink:0, animation:'pulse 1.5s infinite' }} />
                  <p style={{ fontSize:12, color:B.warn, margin:0 }}>Under review — typically 1–2 business days</p>
                </div>
              )}
              {app.status==='DECLINED' && (
                <div style={{ background:'rgba(239,68,68,0.07)', borderRadius:12, padding:'10px 14px', border:'1px solid rgba(239,68,68,0.2)' }}>
                  <p style={{ fontSize:11, color:B.error, margin:0 }}>{app.declineReason} <span onClick={e=>{e.stopPropagation();navigate('marketplace')}} style={{ color:B.emerald, fontWeight:700, cursor:'pointer' }}>Try another offer →</span></p>
                </div>
              )}

              <p style={{ fontSize:11, color:B.dim, margin:'10px 0 0' }}>Ref: {app.ref} · Applied {app.appliedDate}</p>
            </div>
          ))}
        </div>
      </div>
      <BottomTabs tab="apps" pendingApps={apps.filter(a=>a.status==='PENDING').length} onTab={id=>{ onTab(id); if(id==='home') navigate('dashboard'); if(id==='offers') navigate('marketplace'); if(id==='score') navigate('score'); if(id==='profile') navigate('profile'); }} t={t} />
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </div>
  );
}
