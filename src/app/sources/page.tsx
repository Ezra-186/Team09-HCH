import { getProductImageSourcesFromDb } from '@/lib/products';
import styles from './sources.module.css';

export const dynamic = 'force-dynamic';

function displayDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export default async function SourcesPage() {
  const productSources = await getProductImageSourcesFromDb();

  const sourceUrls = Array.from(new Set(productSources.flatMap((product) => {
    const imageUrl = (product.imageUrl ?? '').trim();
    const sourceUrl = (product.imageSourceUrl ?? '').trim();
    if (!imageUrl) {
      return [];
    }

    const linkUrl = sourceUrl || imageUrl;
    return linkUrl ? [linkUrl] : [];
  }))).sort((a, b) => a.localeCompare(b));

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Image Sources</h1>
        <p className={styles.note}>These links credit image owners and original sources used on this site.</p>
      </header>

      {sourceUrls.length === 0 ? (
        <p className={styles.empty}>No image sources are available yet.</p>
      ) : (
        <ul className={styles.list}>
          {sourceUrls.map((url) => (
            <li key={url} className={styles.item}>
              <span className={styles.domain}>{displayDomain(url)}</span>
              <a href={url} target="_blank" rel="noreferrer noopener" className={styles.link}>
                {url}
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
