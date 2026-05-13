'use client';

import { useState, CSSProperties } from 'react';
import { B } from '@/lib/brand';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'dark';

interface Props {
  children: React.ReactNode;
  onPress?: () => void | Promise<void>;
  variant?: Variant;
  style?: CSSProperties;
  small?: boolean;
  disabled?: boolean;
}

const VARIANTS: Record<Variant, CSSProperties> = {
  primary:   { background: B.grad, color: '#fff', boxShadow: '0 4px 20px rgba(16,185,129,0.35)' },
  secondary: { background: B.navyMid, color: B.text, border: `1px solid ${B.navyLt}` },
  outline:   { background: 'transparent', color: B.emerald, border: `1.5px solid ${B.emerald}` },
  ghost:     { background: 'transparent', color: B.muted },
  dark:      { background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' },
};

export function Btn({ children, onPress, variant = 'primary', style = {}, small = false, disabled = false }: Props) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      type="button"
      disabled={disabled}
      onMouseDown={() => !disabled && setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => !disabled && setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onClick={() => { if (!disabled) void onPress?.(); }}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 14, fontSize: small ? 13 : 16, fontWeight: 700,
        fontFamily: 'inherit',
        cursor: disabled ? 'not-allowed' : 'pointer',
        padding: small ? '10px 18px' : '15px 20px', width: '100%',
        opacity: disabled ? 0.5 : pressed ? 0.82 : 1,
        transform: pressed ? 'scale(0.975)' : 'scale(1)',
        transition: 'all 0.15s', userSelect: 'none',
        ...VARIANTS[variant], ...style,
      }}
    >{children}</button>
  );
}
