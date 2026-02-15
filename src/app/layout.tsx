import type { Metadata } from 'next';
import Link from 'next/link';
import { logoutSeller } from '@/app/login/actions';
import HeaderNav from '@/components/HeaderNav';
import { getAuthenticatedSellerId } from '@/lib/auth';
import { getSellerByIdFromDb } from '@/lib/sellers';
import styles from './layout.module.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'HandCraft Heaven',
  description: 'A marketplace for handcrafted items.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sellerId = await getAuthenticatedSellerId();
  const seller = sellerId ? await getSellerByIdFromDb(sellerId) : null;
  const isAuthenticated = Boolean(sellerId && seller);

  return (
    <html lang="en">
      <body>
        <header className={styles.header}>
          <div className={`${styles.container} ${styles.navBar}`}>
            <div className={styles.brandGroup}>
              <Link href="/" className={styles.brand}>
                HandCraft Heaven
              </Link>
              {seller ? <span className={styles.welcome}>Welcome, {seller.name}</span> : null}
            </div>

            <HeaderNav isAuthenticated={isAuthenticated} logoutAction={logoutSeller} />
          </div>
        </header>

        <main className={`${styles.container} ${styles.main}`}>{children}</main>

        <footer className={styles.footer}>
          <div className={`${styles.container} ${styles.footerInner}`}>
            <small>© {new Date().getFullYear()} HandCraft Heaven</small>
            <Link href="/sources" className={styles.footerLink}>
              Image Sources
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
