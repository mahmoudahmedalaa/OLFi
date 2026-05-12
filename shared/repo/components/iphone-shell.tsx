'use client';

import { ReactNode } from 'react';

interface Props { children: ReactNode }

export function IphoneShell({ children }: Props) {
  return (
    <div style={{
      position: 'relative', padding: '14px 13px 18px', borderRadius: 62,
      background: 'linear-gradient(160deg, #FF9A5C 0%, #E8601A 45%, #C44F0E 100%)',
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.22), inset 0 2px 0 rgba(255,255,255,0.28), 0 50px 100px rgba(0,0,0,0.18), 0 20px 40px rgba(210,80,20,0.25), 0 2px 8px rgba(0,0,0,0.12)',
      display: 'inline-block', flexShrink: 0,
    }}>
      {/* glass sheen */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: 62, background: 'linear-gradient(160deg, rgba(255,255,255,0.18) 0%, transparent 45%)', pointerEvents: 'none' }} />
      {/* side buttons */}
      <div style={{ position: 'absolute', background: 'linear-gradient(180deg, #C44F0E, #E8601A)', borderRadius: '3px 0 0 3px', left: -5, width: 5, boxShadow: '-1px 0 3px rgba(0,0,0,0.3)', top: 88, height: 30 }} />
      <div style={{ position: 'absolute', background: 'linear-gradient(180deg, #C44F0E, #E8601A)', borderRadius: '3px 0 0 3px', left: -5, width: 5, boxShadow: '-1px 0 3px rgba(0,0,0,0.3)', top: 132, height: 40 }} />
      <div style={{ position: 'absolute', background: 'linear-gradient(180deg, #C44F0E, #E8601A)', borderRadius: '3px 0 0 3px', left: -5, width: 5, boxShadow: '-1px 0 3px rgba(0,0,0,0.3)', top: 184, height: 40 }} />
      <div style={{ position: 'absolute', background: 'linear-gradient(180deg, #C44F0E, #E8601A)', borderRadius: '0 3px 3px 0', right: -5, width: 5, boxShadow: '1px 0 3px rgba(0,0,0,0.3)', top: 148, height: 72 }} />

      {/* Screen */}
      <div style={{
        width: 393, height: 852, borderRadius: 48, overflow: 'hidden',
        position: 'relative', background: '#0F172A',
        boxShadow: '0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.12)',
      }}>
        {/* Dynamic island */}
        <div style={{ position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)', width: 126, height: 37, borderRadius: 24, background: '#000', zIndex: 50 }} />
        {/* Status bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, display: 'flex', gap: 154, alignItems: 'center', justifyContent: 'center', padding: '21px 24px 19px' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: '-apple-system, system-ui', fontWeight: 590, fontSize: 17, lineHeight: '22px', color: '#fff' }}>9:41</span>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
            {/* signal */}
            <svg width="19" height="12" viewBox="0 0 19 12"><rect x="0" y="7.5" width="3.2" height="4.5" rx="0.7" fill="white"/><rect x="4.8" y="5" width="3.2" height="7" rx="0.7" fill="white"/><rect x="9.6" y="2.5" width="3.2" height="9.5" rx="0.7" fill="white"/><rect x="14.4" y="0" width="3.2" height="12" rx="0.7" fill="white"/></svg>
            {/* wifi */}
            <svg width="17" height="12" viewBox="0 0 17 12"><path d="M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z" fill="white"/><path d="M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z" fill="white"/><circle cx="8.5" cy="10.5" r="1.5" fill="white"/></svg>
            {/* battery */}
            <svg width="27" height="13" viewBox="0 0 27 13"><rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="white" strokeOpacity="0.35" fill="none"/><rect x="2" y="2" width="20" height="9" rx="2" fill="white"/><path d="M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z" fill="white" fillOpacity="0.4"/></svg>
          </div>
        </div>
        {/* Content */}
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
        {/* Home indicator */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 60, height: 34, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: 8, pointerEvents: 'none' }}>
          <div style={{ width: 139, height: 5, borderRadius: 100, background: 'rgba(255,255,255,0.7)' }} />
        </div>
      </div>
    </div>
  );
}
