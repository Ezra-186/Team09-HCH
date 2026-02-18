import Link from 'next/link';
import { getSellersFromDb } from '@/lib/sellers';
import { Seller } from '@/lib/types';
import styles from './sellers.module.css';

export const dynamic = 'force-dynamic';

function getAboutLine(seller: Seller): string {
  const extended = seller as Seller & { story?: string; description?: string; about?: string };
  const raw = seller.bio || extended.story || extended.description || extended.about || '';
  const trimmed = raw.trim();

  if (!trimmed) {
    return '';
  }

  return trimmed.length > 160 ? `${trimmed.slice(0, 160).trimEnd()}...` : trimmed;
}

export default async function SellersPage() {
  const sellers = await getSellersFromDb();

  return (
    <section className={styles.container}>
      <header className={styles.headingGroup}>
        <p className={styles.eyebrow}>Makers</p>
        <h1 className={styles.title}>Sellers</h1>
      </header>

      {sellers.length === 0 ? (
        <p className={styles.emptyState}>No sellers available yet.</p>
      ) : (
        <ul className={styles.grid}>
          {sellers.map((seller) => {
            const aboutLine = getAboutLine(seller);

            return (
              <li key={seller.id} className={styles.card}>
                <Link href={`/sellers/${seller.id}`} className={styles.cardLink}>
                  <h2 className={styles.name}>{seller.name}</h2>
                  {aboutLine ? <p className={styles.about}>{aboutLine}</p> : null}
                  {seller.location ? <p className={styles.meta}>{seller.location}</p> : null}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
