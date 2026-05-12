'use client';

import { useState } from 'react';
import { B, TOOLTIPS } from '@/lib/brand';

interface Props {
  id: string | null;
  customTitle?: string;
  customBody?: string;
}

export function InfoTooltip({ id, customTitle, customBody }: Props) {
  const [open, setOpen] = useState(false);
  const tip = id ? TOOLTIPS[id] : null;
  const title = customTitle ?? tip?.title;
  const body = customBody ?? tip?.body;
  if (!title && !body) return null;

  return (
    <>
      <span
        onClick={e => { e.stopPropagation(); setOpen(true); }}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 16, height: 16, borderRadius: '50%',
          background: 'rgba(16,185,129,0.2)', color: B.emerald,
          fontSize: 10, fontWeight: 900, cursor: 'pointer', flexShrink: 0,
          marginLeft: 4, lineHeight: '1', border: '1px solid rgba(16,185,129,0.4)',
        }}
      >?</span>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'flex-end', padding: '0 0 40px' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: B.navyMid, borderRadius: '24px 24px 0 0', padding: '24px 24px 32px', width: '100%', border: `1px solid ${B.navyLt}`, boxShadow: '0 -8px 40px rgba(0,0,0,0.5)' }}
          >
            <div style={{ width: 40, height: 4, borderRadius: 2, background: B.navyLt, margin: '0 auto 20px' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: B.emerald, fontSize: 16, fontWeight: 900 }}>?</span>
              </div>
              <h3 style={{ color: B.text, fontSize: 18, fontWeight: 800, margin: 0 }}>{title}</h3>
            </div>
            <p style={{ color: B.muted, fontSize: 14, lineHeight: 1.7, margin: '0 0 20px' }}>{body}</p>
            <div
              onClick={() => setOpen(false)}
              style={{ background: B.emerald, color: '#fff', borderRadius: 14, padding: 14, textAlign: 'center', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
            >Got it</div>
          </div>
        </div>
      )}
    </>
  );
}
