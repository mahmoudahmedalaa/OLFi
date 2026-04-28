'use client';

import { useState } from 'react';
import { B } from '@/lib/brand';
import { NavProps } from '@/lib/types';
import { Btn } from '@/components/ui/btn';
import { TopBar } from '@/components/ui/top-bar';

const INP: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box', padding: '14px 16px',
  border: `1.5px solid ${B.navyLt}`, borderRadius: 12, fontSize: 15,
  background: B.navyMid, color: B.text, fontFamily: 'inherit', outline: 'none',
};

export function SignUpScreen({ navigate }: NavProps) {
  const [name, setName]   = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!name || !phone || !email) { setError('Please fill all fields'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Signup failed'); return; }
      // Store phone in sessionStorage for OTP screen
      sessionStorage.setItem('olfi_phone', data.phone ?? phone);
      navigate('otp');
    } catch {
      setError('Network error — please try again');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: 'Full Name',      ph: 'e.g. Ahmed Al Mansoori', val: name,  set: setName,  type: 'text'  },
    { label: 'Mobile (+971)',  ph: '+971 50 000 0000',        val: phone, set: setPhone, type: 'tel'   },
    { label: 'Email Address',  ph: 'you@email.com',           val: email, set: setEmail, type: 'email' },
  ];

  return (
    <div style={{ height: '100%', background: B.navy, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="" onBack={() => navigate('welcome')} />
      <div style={{ flex: 1, overflow: 'auto', padding: '16px 24px 32px' }}>
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: B.text, margin: '0 0 6px', letterSpacing: -0.5 }}>Create your account</h2>
          <p style={{ color: B.muted, fontSize: 14, margin: 0 }}>Start your Sharia-compliant refinance journey</p>
        </div>

        {fields.map(f => (
          <div key={f.label} style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: B.muted, display: 'block', marginBottom: 6 }}>{f.label}</label>
            <input type={f.type} placeholder={f.ph} value={f.val} onChange={e => f.set(e.target.value)} style={INP} />
          </div>
        ))}

        {error && <p style={{ color: B.error, fontSize: 13, marginBottom: 12 }}>{error}</p>}

        <div style={{ background: 'rgba(16,185,129,0.08)', borderRadius: 12, padding: '12px 16px', marginBottom: 24, display: 'flex', gap: 10, border: `1px solid rgba(16,185,129,0.2)` }}>
          <span style={{ fontSize: 16 }}>🔒</span>
          <p style={{ margin: 0, fontSize: 12, color: B.muted, lineHeight: 1.5 }}>Encrypted &amp; secured. CBUAE / ADGM compliant. Never shared without consent.</p>
        </div>

        <Btn onPress={submit} disabled={loading}>{loading ? 'Please wait…' : 'Continue'}</Btn>
        <p style={{ textAlign: 'center', fontSize: 12, color: B.dim, marginTop: 16, lineHeight: 1.6 }}>
          By continuing you agree to our <span style={{ color: B.emerald }}>Terms</span> and <span style={{ color: B.emerald }}>Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}
