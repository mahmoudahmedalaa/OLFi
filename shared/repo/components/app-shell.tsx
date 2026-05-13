'use client';

import { useState, useEffect } from 'react';
import { Screen, Lang, OfferData, ApplicationData, UserData } from '@/lib/types';
import { TRANSLATIONS } from '@/lib/brand';
import { IphoneShell } from '@/components/iphone-shell';
import { WelcomeScreen }      from '@/components/screens/welcome';
import { SignUpScreen }        from '@/components/screens/signup';
import { OTPScreen }           from '@/components/screens/otp';
import { KYCIdScreen }         from '@/components/screens/kyc-id';
import { KYCFaceScreen }       from '@/components/screens/kyc-face';
import { OpenBankingScreen }   from '@/components/screens/open-banking';
import { DashboardScreen }     from '@/components/screens/dashboard';
import { DebtDetailScreen }    from '@/components/screens/debt-detail';
import { MarketplaceScreen }   from '@/components/screens/marketplace';
import { OfferDetailScreen }   from '@/components/screens/offer-detail';
import { ApplyStatusScreen }   from '@/components/screens/apply-status';
import { ApplicationsScreen }  from '@/components/screens/applications';
import { AppDetailScreen }     from '@/components/screens/app-detail';
import { ScoreScreen }         from '@/components/screens/score';
import { ProfileScreen }       from '@/components/screens/profile';

function usePersisted<T>(key: string, initial: T) {
  const [val, setVal] = useState<T>(() => {
    if (typeof window === 'undefined') return initial;
    try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : initial; } catch { return initial; }
  });
  const set = (v: T) => { setVal(v); try { localStorage.setItem(key, JSON.stringify(v)); } catch {} };
  return [val, set] as const;
}

export function AppShell() {
  const [screen, setScreen] = usePersisted<Screen>('olfi_screen', 'welcome');
  const [lang,   setLangRaw] = usePersisted<Lang>('olfi_lang', 'en');
  const [tab, setTab] = useState('home');
  const [offerData, setOffer] = useState<OfferData | null>(null);
  const [appData,   setApp]   = useState<ApplicationData | null>(null);
  const [user, setUser] = useState<UserData | null>(null);

  // Try to restore session on mount
  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (d.user) { setUser(d.user); if (['welcome','signup','otp'].includes(screen)) setScreen('dashboard'); }
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const t = TRANSLATIONS[lang] as Record<string, string>;

  const navigate = (to: Screen, data?: unknown) => {
    if (to === 'offer_detail' && data) setOffer(data as OfferData);
    if (to === 'app_detail'   && data) setApp(data as ApplicationData);
    setScreen(to);
  };

  const onTab = (id: string) => {
    setTab(id);
    if (id === 'home')    navigate('dashboard');
    if (id === 'offers')  navigate('marketplace');
    if (id === 'apps')    navigate('applications');
    if (id === 'score')   navigate('score');
    if (id === 'profile') navigate('profile');
  };

  const handleLang = (l: Lang) => {
    setLangRaw(l);
    fetch('/api/auth/me', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lang: l }) }).catch(() => {});
  };

  const handleSignOut = async () => {
    await fetch('/api/auth/me', { method: 'DELETE', credentials: 'same-origin' });
    setUser(null);
    setTab('home');
    try {
      localStorage.removeItem('olfi_screen');
      sessionStorage.removeItem('olfi_phone');
    } catch {}
    setScreen('welcome');
  };

  const props = { navigate, onTab, t, lang, setLang: handleLang, user, onSignOut: handleSignOut };

  const screens: Record<Screen, React.ReactNode> = {
    welcome:      <WelcomeScreen {...props} />,
    signup:       <SignUpScreen  {...props} />,
    otp:          <OTPScreen     {...props} />,
    kyc_id:       <KYCIdScreen   {...props} />,
    kyc_face:     <KYCFaceScreen {...props} />,
    open_banking: <OpenBankingScreen {...props} />,
    dashboard:    <DashboardScreen   {...props} />,
    debt_detail:  <DebtDetailScreen  {...props} />,
    marketplace:  <MarketplaceScreen {...props} />,
    offer_detail: <OfferDetailScreen {...props} extraData={offerData ?? undefined} />,
    apply_status: <ApplyStatusScreen {...props} />,
    applications: <ApplicationsScreen {...props} />,
    app_detail:   <AppDetailScreen   {...props} extraData={appData ?? undefined} />,
    score:        <ScoreScreen   {...props} />,
    profile:      <ProfileScreen {...props} />,
  };

  return (
    <div style={{ position: 'relative' }}>
      <IphoneShell>
        <div style={{ height: '100%', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", WebkitFontSmoothing: 'antialiased' }}>
          {screens[screen] ?? screens.welcome}
        </div>
      </IphoneShell>

      {/* Tweaks panel for demos */}
      <TweaksPanel navigate={navigate} />
    </div>
  );
}

function TweaksPanel({ navigate }: { navigate: (s: Screen) => void }) {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState<Screen>('welcome');

  const screenOpts: [Screen, string][] = [
    ['welcome',      'Welcome Story'],
    ['signup',       'Sign Up'],
    ['otp',          'OTP Verification'],
    ['kyc_id',       'KYC — Emirates ID'],
    ['kyc_face',     'KYC — Face Check'],
    ['open_banking', 'Open Banking'],
    ['dashboard',    'Dashboard'],
    ['debt_detail',  'Debt Detail'],
    ['marketplace',  'Refinance Marketplace'],
    ['offer_detail', 'Offer Detail'],
    ['apply_status', 'Application Status'],
    ['applications', 'My Applications'],
    ['app_detail',   'Application Detail + Payments'],
    ['score',        'OLFI / CBUAE Score'],
    ['profile',      'Profile'],
  ];

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: 24, right: 24,
          background: 'linear-gradient(135deg,#10B981,#14B8A6)', color: '#fff',
          border: 'none', borderRadius: 12, padding: '10px 16px', fontSize: 13, fontWeight: 700,
          cursor: 'pointer', zIndex: 9998, boxShadow: '0 4px 20px rgba(16,185,129,0.4)',
        }}
      >⚙ Tweaks</button>

      {open && (
        <div style={{
          position: 'fixed', bottom: 70, right: 24, background: '#fff', borderRadius: 20,
          boxShadow: '0 8px 40px rgba(0,0,0,0.12)', padding: 20, width: 272, zIndex: 9999,
          border: '1px solid #E5E7EB', fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: '#111' }}>Tweaks</span>
            <span onClick={() => setOpen(false)} style={{ cursor: 'pointer', fontSize: 18, color: '#6B7280' }}>✕</span>
          </div>
          <label style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, display: 'block' }}>Jump to Screen</label>
          <select
            value={val}
            onChange={e => setVal(e.target.value as Screen)}
            style={{ width: '100%', padding: '9px 10px', borderRadius: 9, border: '1.5px solid #E5E7EB', fontSize: 13, fontFamily: 'inherit', outline: 'none', color: '#111', background: '#F9FAFB', marginBottom: 14 }}
          >
            {screenOpts.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
          </select>
          <button
            onClick={() => { navigate(val); setOpen(false); }}
            style={{ width: '100%', padding: 11, borderRadius: 11, border: 'none', background: 'linear-gradient(135deg,#10B981,#14B8A6)', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
          >Go to Screen →</button>
        </div>
      )}
    </>
  );
}
