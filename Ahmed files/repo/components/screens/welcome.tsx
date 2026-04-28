'use client';

import { useState, useEffect, useRef } from 'react';
import { B, TRANSLATIONS } from '@/lib/brand';
import { NavProps } from '@/lib/types';
import { Btn } from '@/components/ui/btn';
import { LangPicker } from '@/components/ui/lang-picker';

const SLIDES = [
  {
    bg: 'radial-gradient(ellipse at 30% 40%, #1a3a5c 0%, #0F172A 70%)',
    accent: B.emerald,
    headline: (t: Record<string,string>) => t.slide1h,
    sub:      (t: Record<string,string>) => t.slide1s,
    visual: () => (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {Array.from({ length: 18 }).map((_, i) => {
          const angle = (i / 18) * 360;
          const len = 120 + (i * 7) % 120;
          const colors = [B.emerald, B.teal, B.blue];
          return (
            <div key={i} style={{ position: 'absolute', left: '50%', top: '45%', width: 1.5, height: len, background: `linear-gradient(to bottom, transparent, ${colors[i % 3]}55)`, transformOrigin: '50% 0', transform: `rotate(${angle}deg) translateX(-50%)`, opacity: 0.6 }} />
          );
        })}
        <div style={{ position: 'absolute', left: '50%', top: '45%', transform: 'translate(-50%, -50%)', width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)' }} />
      </div>
    ),
  },
  {
    bg: 'linear-gradient(160deg, #0F172A 0%, #0f2a1e 100%)',
    accent: B.teal,
    headline: (t: Record<string,string>) => t.slide2h,
    sub:      (t: Record<string,string>) => t.slide2s,
    visual: () => (
      <div style={{ position: 'absolute', left: '50%', top: '38%', transform: 'translate(-50%,-50%)', width: 240, pointerEvents: 'none' }}>
        {[
          { label: 'Personal Loan · FAB', val: 'AED 85,000', rate: '14.5%', color: '#C8102E' },
          { label: 'Credit Card · ENBD',  val: 'AED 23,400', rate: '22.8%', color: '#E5A000' },
          { label: 'Auto Loan · ADCB',    val: 'AED 42,000', rate: '8.9%',  color: '#E31837' },
        ].map((item, i) => (
          <div key={i} style={{ background: B.navyMid, borderRadius: 12, padding: '10px 14px', marginBottom: 8, border: `1px solid ${B.navyLt}`, display: 'flex', alignItems: 'center', gap: 10, opacity: 1 - i * 0.15, transform: `scale(${1 - i * 0.04})` }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 11, color: B.muted }}>{item.label}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: B.text }}>{item.val}</span>
            <span style={{ fontSize: 11, color: '#EF4444' }}>{item.rate}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    bg: 'linear-gradient(160deg, #0F172A 0%, #0a1f17 100%)',
    accent: B.emerald,
    headline: (t: Record<string,string>) => t.slide3h,
    sub:      (t: Record<string,string>) => t.slide3s,
    visual: () => (
      <div style={{ position: 'absolute', left: '50%', top: '36%', transform: 'translate(-50%,-50%)', pointerEvents: 'none', textAlign: 'center', width: 240 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 16 }}>
          <div style={{ background: '#1a0f0f', borderRadius: 14, padding: '14px 18px', border: '1px solid #3a1515' }}>
            <div style={{ fontSize: 11, color: '#EF4444', fontWeight: 600, marginBottom: 4 }}>Interest</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#EF4444' }}>14.5%</div>
          </div>
          <div style={{ color: B.emerald, fontSize: 22 }}>→</div>
          <div style={{ background: 'rgba(16,185,129,0.12)', borderRadius: 14, padding: '14px 18px', border: `1px solid ${B.emerald}44` }}>
            <div style={{ fontSize: 11, color: B.emerald, fontWeight: 600, marginBottom: 4 }}>Murābaḥa</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: B.emerald }}>8.2%</div>
          </div>
        </div>
        <div style={{ background: 'rgba(16,185,129,0.1)', borderRadius: 10, padding: '8px 16px', border: `1px solid ${B.emerald}30` }}>
          <span style={{ fontSize: 12, color: B.emerald, fontWeight: 700 }}>☪️ AAOIFI Certified Sharia-Compliant</span>
        </div>
      </div>
    ),
  },
  {
    bg: 'linear-gradient(160deg, #0F172A 0%, #0f1a2a 100%)',
    accent: B.blue,
    headline: (t: Record<string,string>) => t.slide4h,
    sub:      (t: Record<string,string>) => t.slide4s,
    visual: () => (
      <div style={{ position: 'absolute', left: '50%', top: '36%', transform: 'translate(-50%,-50%)', pointerEvents: 'none', width: 240 }}>
        {[
          { label: 'OLFI Score', val: 724, max: 850, color: B.emerald, sub: 'AI + Open Banking' },
          { label: 'CBUAE Score', val: 718, max: 900, color: B.blue, sub: 'Via AECB Bureau' },
        ].map(s => (
          <div key={s.label} style={{ background: B.navyMid, borderRadius: 14, padding: '12px 16px', marginBottom: 10, border: `1px solid ${B.navyLt}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: B.muted }}>{s.label}</span>
              <span style={{ fontSize: 16, fontWeight: 900, color: s.color }}>{s.val}</span>
            </div>
            <div style={{ background: B.navyLt, borderRadius: 99, height: 5 }}>
              <div style={{ width: `${(s.val / s.max) * 100}%`, background: s.color, height: '100%', borderRadius: 99 }} />
            </div>
            <div style={{ fontSize: 10, color: B.dim, marginTop: 5 }}>{s.sub}</div>
          </div>
        ))}
      </div>
    ),
  },
];

const DURATION = 4000;

export function WelcomeScreen({ navigate, lang, setLang, t }: NavProps) {
  const [slide, setSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const rafRef = useRef<number>(0);
  const touchStartX = useRef<number>(0);

  useEffect(() => {
    if (paused) return;
    setProgress(0);
    const start = Date.now();
    const tick = () => {
      const pct = Math.min(((Date.now() - start) / DURATION) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setSlide(s => (s + 1) % SLIDES.length);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [slide, paused]);

  const s = SLIDES[slide];

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('button, a, [role=button], input, select, div[data-btn]')) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const clientX = 'clientX' in e ? e.clientX : (e as React.TouchEvent).changedTouches[0].clientX;
    const x = clientX - rect.left;
    if (x < rect.width * 0.35) {
      setSlide(s => Math.max(s - 1, 0));
    } else {
      setSlide(s => (s + 1) % SLIDES.length);
    }
  };

  return (
    <div
      style={{ height: '100%', background: s.bg, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', transition: 'background 0.6s ease', cursor: 'pointer' }}
      onClick={handleTap}
      onTouchStart={e => { touchStartX.current = e.touches[0].clientX; setPaused(true); }}
      onTouchEnd={e => {
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        setPaused(false);
        if (Math.abs(dx) < 10) handleTap(e);
      }}
    >
      {s.visual()}

      {/* Progress bars */}
      <div style={{ position: 'absolute', top: 56, left: 16, right: 16, display: 'flex', gap: 4, zIndex: 10 }}>
        {SLIDES.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 2.5, borderRadius: 2, background: 'rgba(255,255,255,0.25)', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 2, background: '#fff', width: i < slide ? '100%' : i === slide ? `${progress}%` : '0%', transition: i === slide ? 'none' : 'width 0.3s' }} />
          </div>
        ))}
      </div>

      {/* Header: logo + lang */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '66px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/olfi_logo.png" alt="OLFI" style={{ width: 38, height: 38, borderRadius: 10 }} />
          <span style={{ color: '#fff', fontSize: 22, fontWeight: 900, letterSpacing: -0.5 }}>OLFI</span>
        </div>
        <div data-btn="true">
          <LangPicker lang={lang} setLang={setLang} />
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 28px 0', position: 'relative', zIndex: 10 }}>
        <h1 style={{ color: '#fff', fontSize: 30, fontWeight: 900, lineHeight: 1.2, margin: '0 0 12px', letterSpacing: -0.5 }}>
          {s.headline(t)}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{s.sub(t)}</p>
      </div>

      {/* CTAs */}
      <div style={{ padding: '24px 24px 0', position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div data-btn="true"><Btn onPress={() => navigate('signup')} style={{ borderRadius: 16, padding: '17px 20px' }}>{t.getStarted}</Btn></div>
        <div data-btn="true"><Btn variant="dark" onPress={() => navigate('signup')} style={{ borderRadius: 16, padding: '15px 20px' }}>{t.logIn}</Btn></div>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '4px 0 16px', lineHeight: 1.5, direction: 'rtl', fontFamily: 'system-ui' }}>
          {(TRANSLATIONS as Record<string, Record<string, string>>).ar.arabicTag}
        </p>
      </div>
    </div>
  );
}
