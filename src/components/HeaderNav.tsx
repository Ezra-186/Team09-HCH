'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from '@/app/layout.module.css';

type HeaderNavProps = {
  isAuthenticated: boolean;
  logoutAction: () => Promise<void>;
};

export default function HeaderNav({ isAuthenticated, logoutAction }: HeaderNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className={styles.links} aria-label="Main navigation">
        <Link className={styles.link} href="/">
          Home
        </Link>
        <Link className={styles.link} href="/products">
          Products
        </Link>
        <Link className={styles.link} href="/dashboard">
          Dashboard
        </Link>
        {isAuthenticated ? (
          <form action={logoutAction}>
            <button type="submit" className={styles.authButton}>
              Logout
            </button>
          </form>
        ) : (
          <Link className={styles.link} href="/login">
            Login
          </Link>
        )}
      </nav>

      <div className={styles.mobileNav}>
        <button
          type="button"
          className={`${styles.menuButton} ${isMenuOpen ? styles.menuButtonOpen : ''}`}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
          onClick={() => setIsMenuOpen((value) => !value)}
        >
          <span className={styles.menuIcon} aria-hidden="true">
            <span className={`${styles.menuBar} ${styles.menuBar1}`} />
            <span className={`${styles.menuBar} ${styles.menuBar2}`} />
            <span className={`${styles.menuBar} ${styles.menuBar3}`} />
          </span>
        </button>

        {isMenuOpen ? (
          <div id="mobile-nav" className={styles.mobilePanel}>
            <Link className={styles.link} href="/" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link className={styles.link} href="/products" onClick={() => setIsMenuOpen(false)}>
              Products
            </Link>
            <Link className={styles.link} href="/dashboard" onClick={() => setIsMenuOpen(false)}>
              Dashboard
            </Link>
            {isAuthenticated ? (
              <form action={logoutAction} onSubmit={() => setIsMenuOpen(false)} className={styles.mobileNavItem}>
                <button type="submit" className={styles.mobileNavButton}>
                  Logout
                </button>
              </form>
            ) : (
              <Link className={styles.link} href="/login" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
            )}
          </div>
        ) : null}
      </div>
    </>
  );
}
