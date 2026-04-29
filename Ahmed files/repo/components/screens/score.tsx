'use client';

import { useState, useEffect } from 'react';
import { B } from '@/lib/brand';
import { NavProps, ScoreData } from '@/lib/types';
import { BottomTabs } from '@/components/ui/bottom-tabs';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { TopBar } from '@/components/ui/top-bar';

const DEFAULT_SCORE: ScoreData = {
  olfiScore: 724, cbuaeScore: 718,
  loanRepayment: 88, creditCard: 72, billPayments: 90,
  cashFlow: 68, employment: 95, spending: 74, dbr: 61,
};

const BILL_PAYMENTS = [
  { name:'DEWA',           amount:'AED 420', date:'1 Apr', icon:'⚡' },
  { name:'Etisalat (e&)', amount:'AED 299', date:'5 Apr', icon:'📱' },
  { name:'ADDC',           amount:'AED 310', date:'2 Apr', icon:'💧' },
  { name:'Salik',          amount:'AED 100', date:'15 Apr', icon:'🚗' },
];

const TIPS = [
  { tip:'Pay credit card in full this month', impact:'+12 pts', icon:'💳' },
  { tip:'Set up direct debit for DEWA & telecom', impact:'+8 pts', icon:'⚡' },
  { tip:'Reduce credit utilisation below 30%', impact:'+6 pts', icon:'📉' },
  { tip:'Avoid new credit applications for 3 months', impact:'+5 pts', icon:'🚫' },
];

const CBUAE_FACTORS = [
  { label:'Payment History',          score:85, detail:'On-time payments across all UAE credit facilities' },
  { label:'Credit Utilisation',       score:70, detail:'Current balance vs total credit limit across all cards' },
  { label:'Length of Credit History', score:78, detail:'Average age of all open credit accounts in UAE' },
  { label:'New Credit Enquiries',     score:82, detail:'Hard enquiries in the last 12 months' },
  { label:'Credit Mix',               score:75, detail:'Variety of credit types: loans, cards, auto' },
];

export function ScoreScreen({ navigate, onTab, t }: NavProps) {
  const [view, setView] = useState<'olfi'|'cbuae'>('olfi');
  const [score, setScore] = useState<ScoreData>(DEFAULT_SCORE);

  useEffect(() => {
    fetch('/api/score').then(r => r.json()).then(d => { if (d.score) setScore(d.score); }).catch(() => {});
  }, []);

  const olfiFactors = [
    { label:'Loan Repayment History',              score:score.loanRepayment, weight:'25%', color:B.emerald, tip:'On-time payments on all active UAE loans. Based on AECB + open banking data.' },
    { label:'Credit Card & BNPL Discipline',       score:score.creditCard,    weight:'15%', color:B.warn,    tip:'Credit card utilisation, minimum payment behaviour, BNPL on-time completion.' },
    { label:'Bill Payments (DEWA, ADDC, Telecom)', score:score.billPayments,  weight:'15%', color:B.emerald, tip:'Utility bills paid on time — pulled via open banking.' },
    { label:'Open Banking Cash Flow',              score:score.cashFlow,      weight:'20%', color:B.warn,    tip:'Monthly income consistency, salary crediting pattern, and spending-to-income ratio.' },
    { label:'Employment & Salary Stability',       score:score.employment,    weight:'10%', color:B.emerald, tip:'Continuous salary credits from the same employer for 6+ months.' },
    { label:'Spending Behaviour',                  score:score.spending,      weight:'10%', color:B.warn,    tip:'Discretionary vs essential spending ratio, cash withdrawal frequency.' },
    { label:'Debt-to-Income Ratio (DBR)',          score:score.dbr,           weight:'5%',  color:B.error,   tip:"Your current monthly obligations as a % of gross income. CBUAE cap is 50%." },
  ];

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:B.navy }}>
      <div style={{ flex:1, overflow:'auto' }}>
        <div style={{ background:`linear-gradient(160deg, #0a1628, ${B.navyMid})`, padding:'52px 20px 24px' }}>
          <TopBar title="" onBack={() => { onTab('home'); navigate('dashboard'); }} light />
          {/* Toggle */}
          <div style={{ display:'flex', background:B.navyLt, borderRadius:12, padding:3, marginBottom:20 }}>
            {([['olfi','OLFI Score'],['cbuae','CBUAE Score']] as ['olfi'|'cbuae',string][]).map(([id,label]) => (
              <div key={id} onClick={() => setView(id)} style={{ flex:1, padding:9, borderRadius:10, background: view===id?(id==='olfi'?B.emerald:B.blue):'transparent', color: view===id?'#fff':B.muted, fontWeight:700, fontSize:13, textAlign:'center', cursor:'pointer', transition:'all 0.2s' }}>
                {label}
              </div>
            ))}
          </div>
          <div style={{ textAlign:'center' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, marginBottom:4 }}>
              <p style={{ color:B.muted, fontSize:11, margin:0, fontWeight:700, letterSpacing:0.8 }}>
                {view==='olfi' ? 'OLFI ALTERNATIVE CREDIT SCORE' : 'CBUAE / AECB OFFICIAL SCORE'}
              </p>
              <InfoTooltip id={view==='olfi' ? 'olfiScore' : 'cbuaeScore'} />
            </div>
            <div style={{ fontSize:68, fontWeight:900, color:B.text, lineHeight:1, letterSpacing:-2 }}>
              {view==='olfi' ? score.olfiScore : score.cbuaeScore}
            </div>
            <div style={{ fontSize:14, color:view==='olfi'?B.emerald:B.blue, fontWeight:700, margin:'6px 0 2px' }}>GOOD STANDING</div>
            <p style={{ color:B.dim, fontSize:12 }}>/{view==='olfi'?850:900} · Better than 68% of users · ↑ +12 this month</p>
          </div>
        </div>

        <div style={{ padding:16 }}>
          {view==='olfi' ? (
            <>
              <div style={{ background:B.navyMid, borderRadius:20, padding:18, marginBottom:14, border:`1px solid ${B.navyLt}` }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:16 }}>
                  <h4 style={{ fontSize:14, fontWeight:700, color:B.text, margin:0 }}>Alternative Score Breakdown</h4>
                  <InfoTooltip id="olfiScore" />
                </div>
                <div style={{ background:B.navy, borderRadius:12, padding:'10px 14px', marginBottom:16, display:'flex', gap:10, alignItems:'center' }}>
                  <span style={{ fontSize:18 }}>🏦</span>
                  <div>
                    <p style={{ fontSize:12, fontWeight:700, color:B.emerald, margin:'0 0 1px' }}>Beyond the bureau</p>
                    <p style={{ fontSize:11, color:B.muted, margin:0, lineHeight:1.4 }}>OLFI Score uses real financial behaviour — bills, cash flow, spending patterns — not just bureau data.</p>
                  </div>
                </div>
                {olfiFactors.map(f => (
                  <div key={f.label} style={{ marginBottom:16 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6, alignItems:'flex-start', gap:8 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:4, flex:1 }}>
                        <span style={{ fontSize:12, color:B.muted, lineHeight:1.3 }}>{f.label}</span>
                      </div>
                      <div style={{ display:'flex', gap:6, alignItems:'center', flexShrink:0 }}>
                        <span style={{ fontSize:10, color:B.dim, background:B.navyLt, padding:'1px 6px', borderRadius:6 }}>{f.weight}</span>
                        <span style={{ fontSize:13, fontWeight:800, color:f.color, minWidth:28, textAlign:'right' }}>{f.score}</span>
                      </div>
                    </div>
                    <div style={{ background:B.navyLt, borderRadius:99, height:5 }}>
                      <div style={{ width:`${f.score}%`, background:f.color, height:'100%', borderRadius:99, transition:'width 1s ease' }} />
                    </div>
                    <p style={{ fontSize:10, color:B.dim, margin:'4px 0 0', lineHeight:1.4 }}>{f.tip}</p>
                  </div>
                ))}
              </div>

              <div style={{ background:B.navyMid, borderRadius:18, padding:18, marginBottom:14, border:`1px solid ${B.navyLt}` }}>
                <h4 style={{ fontSize:14, fontWeight:700, color:B.text, margin:'0 0 14px' }}>Recent Bill Payments</h4>
                {BILL_PAYMENTS.map(b => (
                  <div key={b.name} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:`1px solid ${B.navyLt}` }}>
                    <span style={{ fontSize:20 }}>{b.icon}</span>
                    <div style={{ flex:1 }}>
                      <p style={{ margin:0, fontSize:13, fontWeight:600, color:B.text }}>{b.name}</p>
                      <p style={{ margin:'1px 0 0', fontSize:11, color:B.dim }}>{b.date} 2026</p>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <p style={{ margin:0, fontSize:13, fontWeight:700, color:B.text }}>{b.amount}</p>
                      <p style={{ margin:'1px 0 0', fontSize:10, color:B.emerald, fontWeight:700 }}>✓ On-time</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ background:B.navyMid, borderRadius:20, padding:18, marginBottom:14, border:`1px solid ${B.navyLt}` }}>
              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16 }}>
                <div style={{ width:44, height:44, borderRadius:14, background:'#1B1464', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ color:'#fff', fontSize:9, fontWeight:800, letterSpacing:0.5 }}>AECB</span>
                </div>
                <div>
                  <p style={{ margin:0, fontSize:14, fontWeight:700, color:B.text }}>Al Etihad Credit Bureau</p>
                  <p style={{ margin:'3px 0 0', fontSize:12, color:B.muted }}>Official UAE credit bureau · Free via OLFI</p>
                </div>
              </div>
              {CBUAE_FACTORS.map(f => (
                <div key={f.label} style={{ marginBottom:14 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                    <span style={{ fontSize:12, color:B.muted }}>{f.label}</span>
                    <span style={{ fontSize:13, fontWeight:800, color:B.blue }}>{f.score}</span>
                  </div>
                  <div style={{ background:B.navyLt, borderRadius:99, height:5 }}>
                    <div style={{ width:`${f.score}%`, background:'linear-gradient(90deg,#3B82F6,#6366F1)', height:'100%', borderRadius:99 }} />
                  </div>
                  <p style={{ fontSize:10, color:B.dim, margin:'4px 0 0' }}>{f.detail}</p>
                </div>
              ))}
            </div>
          )}

          <div style={{ background:B.navyMid, borderRadius:20, padding:18, border:`1px solid ${B.navyLt}` }}>
            <h4 style={{ fontSize:14, fontWeight:700, color:B.text, margin:'0 0 14px' }}>Improvement Tips</h4>
            {TIPS.map(tip => (
              <div key={tip.tip} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:`1px solid ${B.navyLt}` }}>
                <span style={{ fontSize:20 }}>{tip.icon}</span>
                <p style={{ flex:1, margin:0, fontSize:13, color:B.muted, lineHeight:1.4 }}>{tip.tip}</p>
                <span style={{ fontSize:12, fontWeight:800, color:B.emerald, whiteSpace:'nowrap' }}>{tip.impact}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomTabs tab="score" onTab={id=>{ onTab(id); if(id==='home') navigate('dashboard'); if(id==='offers') navigate('marketplace'); if(id==='apps') navigate('applications'); if(id==='profile') navigate('profile'); }} t={t} />
    </div>
  );
}
