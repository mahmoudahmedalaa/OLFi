'use client';

import { useState } from 'react';
import { B } from '@/lib/brand';
import { NavProps } from '@/lib/types';
import { Btn } from '@/components/ui/btn';
import { TopBar } from '@/components/ui/top-bar';

export function KYCIdScreen({ navigate }: NavProps) {
  const [uploaded, setUploaded] = useState({ front: false, back: false });

  return (
    <div style={{ height: '100%', background: B.navy, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="Identity Verification" onBack={() => navigate('otp')} />
      <div style={{ flex: 1, overflow: 'auto', padding: '16px 24px 32px' }}>
        {/* Early adopter banner */}
        <div style={{ background: B.grad, borderRadius: 16, padding: '16px 18px', marginBottom: 24 }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 6, padding: '2px 8px', display: 'inline-block', marginBottom: 8 }}>
            <span style={{ color: '#fff', fontSize: 10, fontWeight: 800, letterSpacing: 1 }}>⚡ EARLY ADOPTER</span>
          </div>
          <p style={{ color: '#fff', fontSize: 14, fontWeight: 600, margin: '0 0 12px', lineHeight: 1.4 }}>Skip full KYC — explore the platform now. Complete verification before your first refinance.</p>
          <Btn onPress={() => navigate('kyc_face')} style={{ background: 'rgba(255,255,255,0.95)', color: B.navy, borderRadius: 12, padding: '12px 20px' }}>✓ Pass as Early Adopter</Btn>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: B.navyLt }} />
          <span style={{ color: B.dim, fontSize: 12, fontWeight: 600 }}>OR COMPLETE KYC</span>
          <div style={{ flex: 1, height: 1, background: B.navyLt }} />
        </div>

        <p style={{ fontSize: 14, color: B.muted, lineHeight: 1.5, margin: '0 0 16px' }}>Upload a clear photo of your <strong style={{ color: B.text }}>Emirates ID</strong>. Required by CBUAE for UAE residents.</p>

        {([
          { side: 'front' as const, label: 'Emirates ID — Front', note: 'Your photo, name & ID number' },
          { side: 'back'  as const, label: 'Emirates ID — Back',  note: 'Expiry date & sponsor info' },
        ]).map(({ side, label, note }) => (
          <div key={side} onClick={() => setUploaded(u => ({ ...u, [side]: true }))} style={{ border: `2px dashed ${uploaded[side] ? B.emerald : B.navyLt}`, borderRadius: 16, padding: '20px 16px', marginBottom: 16, background: uploaded[side] ? 'rgba(16,185,129,0.05)' : B.navyMid, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
            {uploaded[side] ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: B.emerald, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: B.emerald }}>{label} uploaded</div>
                  <div style={{ fontSize: 12, color: B.muted }}>Tap to replace</div>
                </div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🪪</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: B.text }}>{label}</div>
                <div style={{ fontSize: 12, color: B.muted, marginTop: 4 }}>{note}</div>
                <div style={{ fontSize: 12, color: B.emerald, fontWeight: 600, marginTop: 8 }}>Tap to upload</div>
              </>
            )}
          </div>
        ))}

        <Btn onPress={() => navigate('kyc_face')} variant={uploaded.front && uploaded.back ? 'primary' : 'outline'}>
          {uploaded.front && uploaded.back ? 'Continue' : 'Upload both sides to continue'}
        </Btn>
        <p style={{ textAlign: 'center', fontSize: 11, color: B.dim, marginTop: 12 }}>🔒 Encrypted · CBUAE Compliant · Never shared</p>
      </div>
    </div>
  );
}
