import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './layout.module.css';
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
        <header className={styles.header}>
          <div className={`${styles.container} ${styles.navBar}`}>
            <Link href="/" className={styles.brand}>
              HandCraft Heaven
            </Link>
            <nav className={styles.links}>
              <Link className={styles.link} href="/">
                Home
              </Link>
              <Link className={styles.link} href="/products">
                Products
              </Link>
            </nav>
          </div>
        </header>

        <main className={`${styles.container} ${styles.main}`}>{children}</main>

        <footer className={styles.footer}>
          <div className={styles.container}>
            <small>© {new Date().getFullYear()} HandCraft Heaven</small>
          </div>
        </footer>
      </body>
    </html>
  );
}
