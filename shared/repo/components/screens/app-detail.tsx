'use client';

import { B } from '@/lib/brand';
import { NavProps, ApplicationData } from '@/lib/types';
import { TopBar } from '@/components/ui/top-bar';

const DEFAULT_APP: ApplicationData = {
  id: 'app1', bank: 'Dubai Islamic Bank', type: 'Murābaḥa', color: '#0A5C38',
  status: 'ACCEPTED', ref: 'OLFI-DIB-2026-04912', appliedDate: '18 Apr 2026', acceptedDate: '20 Apr 2026',
  amount: 150400, newEmi: 2950, saving: 680, apr: 8.2, tenure: 48,
  paidMonths: 1, totalMonths: 48, nextPayment: '20 May 2026', nextAmount: 2950,
  payments: [
    { month: 'May 2026', amount: 2950, principal: 1900, profit: 1050, balance: 148500, status: 'upcoming' },
    { month: 'Jun 2026', amount: 2950, principal: 1913, profit: 1037, balance: 146587, status: 'upcoming' },
    { month: 'Jul 2026', amount: 2950, principal: 1926, profit: 1024, balance: 144661, status: 'upcoming' },
  ],
};

export function AppDetailScreen({ navigate, extraData }: NavProps & { extraData?: ApplicationData }) {
  const app = extraData ?? DEFAULT_APP;

  return (
    <div style={{ height:'100%', background:B.navy, display:'flex', flexDirection:'column' }}>
      <TopBar title={app.bank} onBack={() => navigate('applications')} />
      <div style={{ flex:1, overflow:'auto', padding:'0 16px 24px' }}>
        {/* Header card */}
        <div style={{ background:app.color, borderRadius:20, padding:18, marginBottom:16 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
            <div>
              <p style={{ color:'rgba(255,255,255,0.7)', fontSize:12, margin:'0 0 2px' }}>Active Refinancing</p>
              <p style={{ color:'#fff', fontSize:28, fontWeight:900, margin:0, letterSpacing:-0.5 }}>
                AED {app.newEmi.toLocaleString()}<span style={{ fontSize:14, fontWeight:500 }}>/mo</span>
              </p>
            </div>
            <div style={{ background:'rgba(255,255,255,0.2)', borderRadius:10, padding:'6px 12px' }}>
              <span style={{ color:'#fff', fontSize:11, fontWeight:700 }}>✓ ACTIVE</span>
            </div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            {([['APR', app.apr+'%'], ['Tenure', app.tenure+' mo'], ['Saving', 'AED '+app.saving+'/mo']] as [string,string][]).map(([l,v]) => (
              <div key={l} style={{ flex:1, background:'rgba(255,255,255,0.12)', borderRadius:10, padding:'10px 8px', textAlign:'center' }}>
                <p style={{ color:'rgba(255,255,255,0.65)', fontSize:10, margin:'0 0 3px' }}>{l}</p>
                <p style={{ color:'#fff', fontSize:14, fontWeight:800, margin:0 }}>{v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Repayment progress */}
        <div style={{ background:B.navyMid, borderRadius:18, padding:18, marginBottom:14, border:`1px solid ${B.navyLt}` }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
            <h4 style={{ fontSize:14, fontWeight:700, color:B.text, margin:0 }}>Repayment Progress</h4>
            <span style={{ fontSize:13, fontWeight:700, color:B.emerald }}>{app.paidMonths}/{app.totalMonths} paid</span>
          </div>
          <div style={{ background:B.navyLt, borderRadius:99, height:8, marginBottom:10, overflow:'hidden' }}>
            <div style={{ width:`${(app.paidMonths/(app.totalMonths||1))*100}%`, background:B.grad, height:'100%', borderRadius:99 }} />
          </div>
          <div style={{ display:'flex', gap:8 }}>
            {([
              ['Paid to date',    `AED ${(app.paidMonths*app.newEmi).toLocaleString()}`],
              ['Remaining',       `AED ${((app.totalMonths-app.paidMonths)*app.newEmi).toLocaleString()}`],
              ['Outstanding',     `AED ${(app.amount-(app.paidMonths*app.newEmi*0.6)).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`],
            ] as [string,string][]).map(([l,v]) => (
              <div key={l} style={{ flex:1, background:B.navy, borderRadius:10, padding:'10px 8px' }}>
                <p style={{ fontSize:10, color:B.dim, margin:'0 0 3px' }}>{l}</p>
                <p style={{ fontSize:12, fontWeight:700, color:B.text, margin:0 }}>{v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Next payment */}
        <div style={{ background:'rgba(16,185,129,0.08)', borderRadius:16, padding:16, marginBottom:14, border:`1px solid rgba(16,185,129,0.25)`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <p style={{ fontSize:11, color:B.muted, margin:'0 0 3px', fontWeight:600 }}>NEXT PAYMENT</p>
            <p style={{ fontSize:20, fontWeight:900, color:B.emerald, margin:'0 0 2px' }}>AED {app.nextAmount?.toLocaleString()}</p>
            <p style={{ fontSize:12, color:B.muted, margin:0 }}>Due {app.nextPayment}</p>
          </div>
          <div style={{ background:B.emerald, borderRadius:12, padding:'12px 18px', cursor:'pointer' }}>
            <p style={{ color:'#fff', fontWeight:700, fontSize:13, margin:0 }}>Pay Now</p>
          </div>
        </div>

        {/* Payment schedule */}
        {app.payments && app.payments.length > 0 && (
          <div style={{ background:B.navyMid, borderRadius:18, padding:18, border:`1px solid ${B.navyLt}` }}>
            <h4 style={{ fontSize:14, fontWeight:700, color:B.text, margin:'0 0 14px' }}>Upcoming Payments</h4>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:4, marginBottom:8 }}>
              {['Month','EMI','Principal','Profit'].map(h => (
                <p key={h} style={{ fontSize:10, fontWeight:700, color:B.dim, margin:0, textAlign:h!=='Month'?'right':'left' }}>{h}</p>
              ))}
            </div>
            {app.payments.map((p, i) => (
              <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:4, padding:'10px 0', borderTop:`1px solid ${B.navyLt}`, alignItems:'center' }}>
                <p style={{ fontSize:12, color:B.text, margin:0, fontWeight:600 }}>{p.month}</p>
                <p style={{ fontSize:12, fontWeight:700, color:B.emerald, margin:0, textAlign:'right' }}>AED {p.amount.toLocaleString()}</p>
                <p style={{ fontSize:12, color:B.text, margin:0, textAlign:'right' }}>AED {p.principal.toLocaleString()}</p>
                <p style={{ fontSize:12, color:B.muted, margin:0, textAlign:'right' }}>AED {p.profit.toLocaleString()}</p>
              </div>
            ))}
            <div style={{ marginTop:12, padding:'10px 14px', background:B.navy, borderRadius:10 }}>
              <p style={{ fontSize:11, color:B.muted, margin:'0 0 2px' }}>Total Profit (Murābaḥa) over full term</p>
              <p style={{ fontSize:14, fontWeight:700, color:B.text, margin:0 }}>AED {Math.round(app.newEmi*app.tenure - app.amount).toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
