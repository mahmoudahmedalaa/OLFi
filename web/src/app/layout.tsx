import type { Metadata } from 'next';
import { Inter, Cairo } from 'next/font/google';
import { LanguageProvider } from '@/contexts/LanguageContext';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'OLFi | Consolidate Your Debt',
  description: 'A premium UAE debt consolidation app.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cairo.variable} h-full antialiased scroll-smooth`}>
      <body className="min-h-full flex flex-col font-sans bg-base-dark text-base-beige selection:bg-brand-teal/30 selection:text-base-beige">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
