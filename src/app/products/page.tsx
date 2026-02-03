import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import styles from './products.module.css';
import { getAverageRatingForProduct, getProducts, getReviewsByProductId, getSellers } from '@/lib/data';

type SearchParams = {
  q?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
};

function parsePrice(value?: string): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

type ProductsPageProps = {
  searchParams?: Promise<SearchParams>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const sp = (await searchParams) ?? {};

  const products = getProducts();
  const sellers = getSellers();
  const sellerById = new Map(sellers.map((seller) => [seller.id, seller]));

  const query = sp.q?.trim().toLowerCase() ?? '';
  const category = sp.category?.trim() ?? '';
  const minPrice = parsePrice(sp.minPrice);
  const maxPrice = parsePrice(sp.maxPrice);

  const categories = Array.from(new Set(products.map((product) => product.category))).sort();

  const filteredProducts = products.filter((product) => {
    const matchesQuery = query
      ? product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query)
      : true;
    const matchesCategory = category ? product.category === category : true;
    const matchesMin = minPrice !== undefined ? product.price >= minPrice : true;
    const matchesMax = maxPrice !== undefined ? product.price <= maxPrice : true;

    return matchesQuery && matchesCategory && matchesMin && matchesMax;
  });

  return (
    <section className={styles.page}>
      <header className={styles.headingGroup}>
        <p className={styles.eyebrow}>Catalog</p>
        <h1 className={styles.title}>Featured pieces</h1>
        <p className={styles.subtitle}>
          Hand-selected goods from independent makers. Browse by category or explore each seller&apos;s collection.
        </p>
      </header>

      <section className={styles.filterSection} aria-label="Product filters">
        <form className={styles.filterForm} action="/products" method="get">
          <div className={styles.fieldRow}>
            <label className={styles.field}>
              <span className={styles.label}>Search</span>
              <input
                type="search"
                name="q"
                defaultValue={sp.q ?? ''}
                placeholder="Search names and descriptions"
                className={styles.input}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Category</span>
              <select name="category" defaultValue={category} className={styles.select}>
                <option value="">All categories</option>
                {categories.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className={styles.fieldRow}>
            <label className={styles.field}>
              <span className={styles.label}>Min price</span>
              <input
                type="number"
                name="minPrice"
                min="0"
                step="1"
                placeholder="0"
                defaultValue={sp.minPrice ?? ''}
                className={styles.input}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Max price</span>
              <input
                type="number"
                name="maxPrice"
                min="0"
                step="1"
                placeholder="200"
                defaultValue={sp.maxPrice ?? ''}
                className={styles.input}
              />
            </label>
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.applyButton}>
              Apply filters
            </button>
            <Link href="/products" className={styles.clearLink} prefetch={false}>
              Clear
            </Link>
          </div>
        </form>
      </section>

      {filteredProducts.length === 0 ? (
        <p className={styles.emptyState}>No products match these filters yet. Try adjusting your search.</p>
      ) : (
        <div className={styles.grid}>
          {filteredProducts.map((product) => {
            const seller = sellerById.get(product.sellerId);
            if (!seller) return null;

            const productReviews = getReviewsByProductId(product.id);
            const averageRating = getAverageRatingForProduct(product.id);

            return (
              <ProductCard
                key={product.id}
                product={product}
                seller={seller}
                averageRating={averageRating}
                reviewCount={productReviews.length}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
