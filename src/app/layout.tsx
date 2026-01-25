import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'HandCraft Heaven',
  description: 'A marketplace for handcrafted items.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header style={{ padding: '1rem' }}>
          <nav style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/">Home</Link>
            <Link href="/products">Products</Link>
          </nav>
        </header>

        <main style={{ padding: '1rem' }}>{children}</main>

        <footer style={{ padding: '1rem' }}>
          <small>© {new Date().getFullYear()} HandCraft Heaven</small>
        </footer>
      </body>
    </html>
  );
}
