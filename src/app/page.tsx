import Link from 'next/link';
import styles from './home.module.css';

const features = [
  {
    title: 'Maker-first marketplace',
    copy: 'Transparent pricing that supports the artisans behind every piece.',
  },
  {
    title: 'Earth-friendly materials',
    copy: 'Natural fibers, reclaimed wood, small-batch glazes, and low-waste packaging.',
  },
  {
    title: 'Thoughtful gifting',
    copy: 'Curated sets and handwritten notes available for every order.',
  },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>HandCraft Heaven</p>
        <h1 className={styles.headline}>Discover one-of-a-kind pieces made by independent artisans.</h1>
        <p className={styles.subhead}>
          From hand thrown ceramics to plant-dyed textiles, every item here is crafted with care, story,
          and sustainable materials.
        </p>
        <div className={styles.actions}>
          <Link href="/products" className={styles.primary}>
            Browse the collection
          </Link>
          <a href="#promise" className={styles.secondary}>
            What makes us different
          </a>
        </div>
      </section>

      <section id="promise">
        <h2 className={styles.sectionHeading}>Curated with intention</h2>
        <p className={styles.sectionText}>
          We partner directly with small makers to bring together timeless, functional pieces. No dropshipping,
          no mass production just slow made goods that you&apos;ll keep for years.
        </p>
        <div className={styles.features}>
          {features.map((item) => (
            <article key={item.title} className={styles.card}>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardText}>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
