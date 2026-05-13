'use client';

import { B } from '@/lib/brand';
import { NavProps } from '@/lib/types';
import { BottomTabs } from '@/components/ui/bottom-tabs';
import { LangPicker } from '@/components/ui/lang-picker';
import { Btn } from '@/components/ui/btn';

export function ProfileScreen({ navigate, onTab, t, lang, setLang, user, onSignOut }: NavProps) {
  const signOut = async () => {
    if (onSignOut) {
      await onSignOut();
      return;
    }
    await fetch('/api/auth/me', { method: 'DELETE', credentials: 'same-origin' });
    try {
      localStorage.removeItem('olfi_screen');
      sessionStorage.removeItem('olfi_phone');
      document.cookie = 'olfi_token=; Max-Age=0; path=/; SameSite=Lax';
    } catch {}
    window.history.replaceState(null, '', '/');
    navigate('welcome');
  };

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:B.navy }}>
      <div style={{ flex:1, overflow:'auto' }}>
        <div style={{ background:`linear-gradient(160deg, #0a1628, ${B.navyMid})`, padding:'52px 20px 28px', textAlign:'center' }}>
          <div style={{ width:68, height:68, borderRadius:'50%', background:B.navyLt, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 10px', fontSize:28 }}>👤</div>
          <h2 style={{ color:B.text, fontSize:18, fontWeight:800, margin:'0 0 4px' }}>{user?.name ?? 'Ahmed Hassan'}</h2>
          <p style={{ color:B.muted, fontSize:13, margin:'0 0 10px' }}>{user?.email ?? 'ahmed.hassan@email.com'}</p>
          <div style={{ display:'flex', justifyContent:'center', gap:6 }}>
            <span style={{ background:'rgba(16,185,129,0.15)', color:B.emerald, fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:99 }}>⚡ Early Adopter</span>
            <span style={{ background:'rgba(245,158,11,0.15)', color:B.warn, fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:99 }}>
              {user?.kycStatus === 'COMPLETE' ? '✓ KYC Complete' : 'KYC Pending'}
            </span>
          </div>
        </div>

        <div style={{ padding:'20px 16px' }}>
          <p style={{ fontSize:12, fontWeight:700, color:B.dim, letterSpacing:0.8, margin:'0 4px 8px', textTransform:'uppercase' }}>Language</p>
          <div style={{ background:B.navyMid, borderRadius:14, padding:'14px 18px', marginBottom:20, border:`1px solid ${B.navyLt}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:14, color:B.text, fontWeight:600 }}>Select Language</span>
              <LangPicker lang={lang} setLang={setLang} />
            </div>
          </div>

          {[
            { section:'Account', items:[
              { label:'Complete KYC Verification', sub:'Required before first refinance', action:() => navigate('kyc_id'), highlight:true },
              { label:'Connect Bank Accounts', sub:'Open banking via Lean Technologies', action:() => navigate('open_banking') },
              { label:'Notification Settings', action:() => {} },
            ]},
            { section:'Legal', items:[
              { label:'Terms of Service', action:() => {} },
              { label:'Privacy Policy', action:() => {} },
              { label:'Sharia Compliance Framework', action:() => {} },
              { label:'CBUAE Regulatory Info', action:() => {} },
            ]},
          ].map(group => (
            <div key={group.section} style={{ marginBottom:16 }}>
              <p style={{ fontSize:12, fontWeight:700, color:B.dim, letterSpacing:0.8, margin:'0 4px 8px', textTransform:'uppercase' }}>{group.section}</p>
              <div style={{ background:B.navyMid, borderRadius:14, overflow:'hidden', border:`1px solid ${B.navyLt}` }}>
                {group.items.map((item, i) => (
                  <div key={item.label} onClick={item.action} style={{ padding:'14px 18px', display:'flex', alignItems:'center', gap:12, cursor:'pointer', borderBottom: i < group.items.length-1 ? `1px solid ${B.navyLt}` : 'none', background: item.highlight ? 'rgba(16,185,129,0.06)' : 'transparent' }}>
                    <div style={{ flex:1 }}>
                      <p style={{ margin:0, fontSize:14, fontWeight:600, color: item.highlight ? B.emerald : B.text }}>{item.label}</p>
                      {'sub' in item && item.sub && <p style={{ margin:'2px 0 0', fontSize:12, color:B.muted }}>{item.sub}</p>}
                    </div>
                    <svg width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M1 1l5 5-5 5" stroke={item.highlight ? B.emerald : B.dim} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <Btn variant="outline" style={{ borderColor:B.error, color:B.error, background:'rgba(239,68,68,0.06)' }} onPress={signOut}>Sign Out</Btn>
        </div>
      </div>
      <BottomTabs tab="profile" onTab={id=>{ onTab(id); if(id==='home') navigate('dashboard'); if(id==='offers') navigate('marketplace'); if(id==='score') navigate('score'); if(id==='apps') navigate('applications'); }} t={t} />
    </div>
  );
}
