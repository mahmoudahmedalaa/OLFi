import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy:    '#0F172A',
        navyMid: '#1E293B',
        navyLt:  '#334155',
        emerald: '#10B981',
        teal:    '#14B8A6',
      },
      fontFamily: {
        jakarta: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
