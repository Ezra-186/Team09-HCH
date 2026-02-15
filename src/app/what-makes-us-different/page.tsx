import Link from 'next/link';
import styles from './page.module.css';

const sections = [
  {
    title: 'Curated makers',
    copy: 'We work with independent sellers who build in small batches and care about quality over volume.',
  },
  {
    title: 'Honest materials',
    copy: 'Each listing highlights practical details about materials and finish so buyers know what they are getting.',
  },
  {
    title: 'Built to last',
    copy: 'Products are selected for daily use, repairability, and timeless design instead of short-term trends.',
  },
  {
    title: 'Community feedback',
    copy: 'Real customer reviews help makers improve and help new buyers choose with confidence.',
  },
];

export default function WhatMakesUsDifferentPage() {
  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>About</p>
        <h1 className={styles.title}>What Makes Us Different</h1>
        <p className={styles.subtitle}>
          HandCraft Heaven is built around quality makers, transparent materials, and products that are meant to be
          used for years.
        </p>
      </header>

      <div className={styles.grid}>
        {sections.map((section) => (
          <article key={section.title} className={styles.card}>
            <h2>{section.title}</h2>
            <p>{section.copy}</p>
          </article>
        ))}
      </div>

      <Link href="/products" className={styles.cta}>
        Browse products
      </Link>
    </section>
  );
}
