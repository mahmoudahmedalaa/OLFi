'use client';

import { useState } from 'react';
import { B } from '@/lib/brand';
import { NavProps } from '@/lib/types';
import { Btn } from '@/components/ui/btn';
import { TopBar } from '@/components/ui/top-bar';

const BANKS = [
  { id: 'fab',  name: 'First Abu Dhabi Bank',    color: '#C8102E', short: 'FAB'  },
  { id: 'enbd', name: 'Emirates NBD',             color: '#1A1A1A', short: 'ENBD' },
  { id: 'adcb', name: 'ADCB',                     color: '#E31837', short: 'ADCB' },
  { id: 'dib',  name: 'Dubai Islamic Bank',       color: '#0A5C38', short: 'DIB'  },
  { id: 'adib', name: 'Abu Dhabi Islamic Bank',   color: '#1B1464', short: 'ADIB' },
];

export function OpenBankingScreen({ navigate }: NavProps) {
  const [connected, setConnected] = useState<string[]>([]);

  const toggle = (id: string) =>
    setConnected(c => c.includes(id) ? c.filter(x => x !== id) : [...c, id]);

  return (
    <div style={{ height: '100%', background: B.navy, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="Connect Accounts" onBack={() => navigate('kyc_face')} />
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 24px 24px' }}>
        <div style={{ background: B.grad, borderRadius: 14, padding: '14px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#fff', fontSize: 13, fontWeight: 700, marginBottom: 2 }}>Early Adopter — Skip for now</div>
            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>Use demo data to explore the platform</div>
          </div>
          <div onClick={() => navigate('dashboard')} style={{ background: 'rgba(255,255,255,0.9)', color: B.navy, fontSize: 12, fontWeight: 700, padding: '8px 14px', borderRadius: 10, cursor: 'pointer', whiteSpace: 'nowrap' }}>Pass →</div>
        </div>

        <p style={{ fontSize: 14, color: B.muted, lineHeight: 1.5, marginBottom: 16 }}>Connect UAE bank accounts to import your liabilities. Powered by <strong style={{ color: B.text }}>Lean Technologies</strong> open banking consent.</p>

        {BANKS.map(b => {
          const on = connected.includes(b.id);
          return (
            <div key={b.id} onClick={() => toggle(b.id)} style={{ background: B.navyMid, borderRadius: 14, padding: '14px 16px', marginBottom: 10, border: `1.5px solid ${on ? B.emerald : B.navyLt}`, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: b.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#fff' }}>{b.short}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: B.text }}>{b.name}</div>
                <div style={{ fontSize: 12, color: B.muted, marginTop: 1 }}>{on ? '✓ Connected' : 'Tap to connect'}</div>
              </div>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: on ? B.emerald : B.navyLt, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                {on && <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
            </div>
          );
        })}

        <div style={{ marginTop: 16 }}>
          <Btn onPress={() => navigate('dashboard')} variant={connected.length > 0 ? 'primary' : 'outline'}>
            {connected.length > 0 ? `Continue with ${connected.length} bank${connected.length > 1 ? 's' : ''}` : 'Connect at least one bank'}
          </Btn>
        </div>
      </div>
    </div>
  );
}
