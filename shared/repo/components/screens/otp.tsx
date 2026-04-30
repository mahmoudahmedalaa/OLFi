'use client';

import { useState, useEffect } from 'react';
import { B } from '@/lib/brand';
import { NavProps } from '@/lib/types';
import { Btn } from '@/components/ui/btn';
import { TopBar } from '@/components/ui/top-bar';

export function OTPScreen({ navigate }: NavProps) {
  const [otp] = useState(['5', '3', '8', '2', '1', '9']);
  const [timer, setTimer] = useState(29);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const id = setInterval(() => setTimer(v => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  const verify = async () => {
    setLoading(true); setError('');
    const phone = sessionStorage.getItem('olfi_phone') ?? '';
    const code = otp.join('');
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Invalid code'); return; }
      navigate('kyc_id');
    } catch {
      setError('Network error — please try again');
    } finally {
      setLoading(false);
    }
  };

  const phone = typeof window !== 'undefined' ? (sessionStorage.getItem('olfi_phone') ?? '+971 50 123 4567') : '+971 50 123 4567';

  return (
    <div style={{ height: '100%', background: B.navy, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="" onBack={() => navigate('signup')} />
      <div style={{ flex: 1, padding: '24px 24px 32px' }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, border: `1px solid rgba(16,185,129,0.2)` }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="5" y="2" width="14" height="20" rx="2" stroke={B.emerald} strokeWidth="2"/><path d="M9 18h6" stroke={B.emerald} strokeWidth="2" strokeLinecap="round"/></svg>
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: B.text, margin: '0 0 8px' }}>Verify your number</h2>
        <p style={{ color: B.muted, fontSize: 14, margin: '0 0 8px' }}>6-digit code sent to <strong style={{ color: B.text }}>{phone}</strong></p>
        <p style={{ color: B.emerald, fontSize: 12, margin: '0 0 32px', fontWeight: 600 }}>Demo code: 538219</p>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 32 }}>
          {otp.map((d, i) => (
            <div key={i} style={{ width: 46, height: 56, borderRadius: 12, background: B.navyMid, border: `2px solid ${i < 4 ? B.emerald : B.navyLt}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: B.text }}>
              {d}
            </div>
          ))}
        </div>

        {error && <p style={{ color: B.error, fontSize: 13, marginBottom: 12 }}>{error}</p>}
        <Btn onPress={verify} disabled={loading}>{loading ? 'Verifying…' : 'Verify & Continue'}</Btn>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          {timer > 0
            ? <p style={{ color: B.muted, fontSize: 14 }}>Resend in <strong style={{ color: B.emerald }}>0:{timer.toString().padStart(2, '0')}</strong></p>
            : <p style={{ color: B.emerald, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Resend Code</p>}
        </div>
      </div>
    </div>
  );
}
