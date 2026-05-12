'use client';

import { B } from '@/lib/brand';

interface Props {
  tab: string;
  onTab: (id: string) => void;
  t: Record<string, string>;
  pendingApps?: number;
}

export function BottomTabs({ tab, onTab, t, pendingApps = 0 }: Props) {
  const tabs = [
    { id: 'home',    label: t.home,    icon: (c: string) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 12L12 3l9 9" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    { id: 'offers',  label: t.offers,  icon: (c: string) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="13" rx="2" stroke={c} strokeWidth="2"/><path d="M3 10h18M7 15h4" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg> },
    { id: 'apps',    label: 'My Apps', icon: (c: string) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke={c} strokeWidth="2" strokeLinecap="round"/><rect x="9" y="3" width="6" height="4" rx="1" stroke={c} strokeWidth="2"/><path d="M9 12l2 2 4-4" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>, badge: pendingApps },
    { id: 'score',   label: t.score,   icon: (c: string) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    { id: 'profile', label: t.profile, icon: (c: string) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke={c} strokeWidth="2"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg> },
  ];

  return (
    <div style={{ display: 'flex', background: B.navyMid, borderTop: `1px solid ${B.navyLt}`, paddingBottom: 24, paddingTop: 10 }}>
      {tabs.map(tb => {
        const active = tab === tb.id;
        const c = active ? B.emerald : B.dim;
        return (
          <div key={tb.id} onClick={() => onTab(tb.id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer', position: 'relative' }}>
            {tb.icon(c)}
            {(tb.badge ?? 0) > 0 && (
              <div style={{ position: 'absolute', top: 0, right: '20%', width: 14, height: 14, borderRadius: '50%', background: B.warn, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 8, fontWeight: 800, color: '#fff' }}>{tb.badge}</span>
              </div>
            )}
            <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: c }}>{tb.label}</span>
          </div>
        );
      })}
    </div>
  );
}
