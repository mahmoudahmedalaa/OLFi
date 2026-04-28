'use client';

import { useState } from 'react';
import { B } from '@/lib/brand';
import { NavProps } from '@/lib/types';
import { Btn } from '@/components/ui/btn';
import { TopBar } from '@/components/ui/top-bar';

export function KYCFaceScreen({ navigate }: NavProps) {
  const [scanning, setScanning] = useState(false);
  const [done, setDone] = useState(false);

  const start = () => {
    setScanning(true);
    setTimeout(() => { setScanning(false); setDone(true); }, 2000);
  };

  return (
    <div style={{ height: '100%', background: B.navy, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="Liveness Check" onBack={() => navigate('kyc_id')} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 24px 32px' }}>
        <div style={{ width: '100%', background: 'rgba(16,185,129,0.08)', borderRadius: 14, padding: '12px 16px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 12, border: `1px solid rgba(16,185,129,0.2)` }}>
          <span style={{ fontSize: 20 }}>⚡</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: B.emerald }}>Early Adopter Mode</div>
            <div style={{ fontSize: 12, color: B.muted }}>Skip — verify before first refinance</div>
          </div>
          <div onClick={() => navigate('open_banking')} style={{ background: B.emerald, color: '#fff', fontSize: 12, fontWeight: 700, padding: '6px 12px', borderRadius: 8, cursor: 'pointer' }}>Pass</div>
        </div>

        <div style={{ position: 'relative', marginBottom: 28, marginTop: 8 }}>
          <div style={{ width: 190, height: 190, borderRadius: '50%', border: `3px solid ${done ? B.emerald : scanning ? B.teal : B.navyLt}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: B.navyMid, boxShadow: scanning ? `0 0 0 10px rgba(16,185,129,0.08)` : 'none', transition: 'all 0.4s' }}>
            {done
              ? <div style={{ textAlign: 'center' }}><div style={{ fontSize: 48, color: B.emerald }}>✓</div><div style={{ fontSize: 12, color: B.emerald, fontWeight: 700 }}>Verified</div></div>
              : <svg width="72" height="72" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke={scanning ? B.teal : B.muted} strokeWidth="1.5"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={scanning ? B.teal : B.muted} strokeWidth="1.5" strokeLinecap="round"/></svg>
            }
          </div>
          {scanning && (
            <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: `2px solid ${B.emerald}`, animation: 'spin 1.5s linear infinite' }} />
          )}
        </div>

        <h3 style={{ fontSize: 20, fontWeight: 800, color: B.text, textAlign: 'center', margin: '0 0 8px' }}>{done ? 'Liveness Verified!' : 'Face Verification'}</h3>
        <p style={{ fontSize: 14, color: B.muted, textAlign: 'center', margin: '0 0 24px', lineHeight: 1.5 }}>{done ? 'Identity confirmed successfully.' : 'Look straight at the camera. Ensure good lighting.'}</p>

        {!done
          ? <Btn onPress={start} variant={scanning ? 'outline' : 'primary'}>{scanning ? 'Scanning…' : 'Start Face Scan'}</Btn>
          : <Btn onPress={() => navigate('open_banking')}>Continue</Btn>
        }
      </div>
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}
