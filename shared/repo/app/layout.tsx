import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'OLFI — UAE Refinance Marketplace',
  description: 'Sharia-compliant debt refinancing platform for UAE residents',
  icons: { icon: '/olfi_favicon.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body>
        <div id="root-wrapper">{children}</div>
      </body>
    </html>
  );
}
