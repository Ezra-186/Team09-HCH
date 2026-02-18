import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import styles from './products.module.css';
import { getProductsFromDb } from '@/lib/products';
import { getReviewStatsForProducts } from '@/lib/reviews';
import { getSellersFromDb } from '@/lib/sellers';

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

export const dynamic = 'force-dynamic';

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const sp = (await searchParams) ?? {};
  const search = sp.q ?? '';
  const selectedCategory = sp.category?.trim() ?? '';
  const minPriceParam = sp.minPrice ?? '';
  const maxPriceParam = sp.maxPrice ?? '';
  const filterFormKey = `${search}|${selectedCategory}|${minPriceParam}|${maxPriceParam}`;

  const [products, sellers] = await Promise.all([getProductsFromDb(), getSellersFromDb()]);
  const sellerById = new Map(sellers.map((seller) => [seller.id, seller]));

  const query = search.trim().toLowerCase();
  const category = selectedCategory;
  const minPrice = parsePrice(sp.minPrice);
  const rawMaxPrice = parsePrice(sp.maxPrice);
  const maxPrice =
    minPrice !== undefined && rawMaxPrice !== undefined && minPrice > rawMaxPrice ? undefined : rawMaxPrice;

  const categories = Array.from(
    new Set(products.map((product) => product.category).filter((value): value is string => Boolean(value))),
  ).sort();

  const filteredProducts = products.filter((product) => {
    const matchesQuery = query
      ? product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query)
      : true;
    const matchesCategory = category ? product.category === category : true;
    const matchesMin = minPrice !== undefined ? product.price >= minPrice : true;
    const matchesMax = maxPrice !== undefined ? product.price <= maxPrice : true;

    return matchesQuery && matchesCategory && matchesMin && matchesMax;
  });

  const reviewStats = await getReviewStatsForProducts(filteredProducts.map((product) => product.id));

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
        <form key={filterFormKey} className={styles.filterForm} action="/products" method="get">
          <div className={styles.fieldRow}>
            <label className={styles.field}>
              <span className={styles.label}>Search</span>
              <input
                type="search"
                name="q"
                defaultValue={search}
                placeholder="Search names and descriptions"
                className={styles.input}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Category</span>
              <select name="category" defaultValue={selectedCategory} className={styles.select}>
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
                defaultValue={minPriceParam}
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
                defaultValue={maxPriceParam}
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

            const stats = reviewStats.get(product.id) ?? { count: 0, average: 0 };

            return (
              <ProductCard
                key={product.id}
                product={product}
                seller={seller}
                averageRating={stats.average}
                reviewCount={stats.count}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
