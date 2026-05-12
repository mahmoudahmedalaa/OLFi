'use client';

import { CSSProperties, ReactNode } from 'react';
import { B } from '@/lib/brand';

interface Props {
  title?: string;
  onBack?: () => void;
  rightEl?: ReactNode;
  light?: boolean;
  style?: CSSProperties;
}

export function TopBar({ title, onBack, rightEl, light = false, style }: Props) {
  const c = light ? '#fff' : B.text;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px 8px', minHeight: 52, ...style }}>
      {onBack ? (
        <div onClick={onBack} style={{ cursor: 'pointer', padding: 6, marginLeft: -6 }}>
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
            <path d="M9 1L1 9l8 8" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      ) : <div style={{ width: 28 }} />}
      {title && <span style={{ fontSize: 16, fontWeight: 700, color: c, letterSpacing: -0.3 }}>{title}</span>}
      {rightEl || <div style={{ width: 28 }} />}
    </div>
  );
}
