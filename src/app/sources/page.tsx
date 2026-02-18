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

  const sourceUrls = Array.from(new Set(productSources.flatMap((row) => {
    const sourceLink =
      row.imageSourceUrl && row.imageSourceUrl.trim()
        ? row.imageSourceUrl.trim()
        : row.imageUrl && row.imageUrl.trim()
          ? row.imageUrl.trim()
          : '';
    return sourceLink ? [sourceLink] : [];
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
          {sourceUrls.map((sourceLink) => (
            <li key={sourceLink} className={styles.item}>
              <span className={styles.domain}>{displayDomain(sourceLink)}</span>
              <a href={sourceLink} target="_blank" rel="noreferrer noopener" className={styles.link}>
                {sourceLink}
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
