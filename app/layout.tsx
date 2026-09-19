import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dash — Session Gate',
  description: 'Dash manual session gate with CBE and telebirr portals in one deployment.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
