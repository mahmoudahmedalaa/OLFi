'use client';

import { B } from '@/lib/brand';
import { Lang } from '@/lib/types';

interface Props { lang: Lang; setLang: (l: Lang) => void; }

const LANGS: [Lang, string][] = [['en', 'EN'], ['ar', 'عر'], ['ur', 'اردو'], ['hi', 'हि']];

export function LangPicker({ lang, setLang }: Props) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {LANGS.map(([id, label]) => (
        <div key={id} onClick={() => setLang(id)} style={{
          padding: '4px 9px', borderRadius: 8, cursor: 'pointer',
          background: lang === id ? B.emerald : 'rgba(255,255,255,0.1)',
          color: lang === id ? '#fff' : 'rgba(255,255,255,0.55)',
          fontSize: 11, fontWeight: 700, transition: 'all 0.15s',
        }}>{label}</div>
      ))}
    </div>
  );
}
