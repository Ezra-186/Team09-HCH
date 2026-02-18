import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import styles from './seller-profile.module.css';
import { getProductsBySellerIdFromDb } from '@/lib/products';
import { getReviewStatsForProducts } from '@/lib/reviews';
import { getSellerByIdFromDb } from '@/lib/sellers';
import { Seller } from '@/lib/types';

type SellerPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = 'force-dynamic';

export default async function SellerProfilePage({ params }: SellerPageProps) {
  const { id } = await params;
  const seller = await getSellerByIdFromDb(id);

  if (!seller) {
    notFound();
  }

  const about =
    seller.bio ||
    (seller as Seller & { story?: string; description?: string; about?: string }).story ||
    (seller as Seller & { story?: string; description?: string; about?: string }).description ||
    (seller as Seller & { story?: string; description?: string; about?: string }).about;
  const sellerProducts = await getProductsBySellerIdFromDb(seller.id);
  const reviewStats = await getReviewStatsForProducts(sellerProducts.map((product) => product.id));

  return (
    <section className={styles.container}>
      <header className={styles.headerCard}>
        <p className={styles.eyebrow}>Seller Profile</p>
        <h1 className={styles.title}>{seller.name}</h1>
        {seller.location ? <p className={styles.meta}>{seller.location}</p> : null}
        {about ? <p className={styles.about}>{about}</p> : null}
      </header>

      <section className={styles.productsSection}>
        <h2 className={styles.sectionTitle}>Products by {seller.name}</h2>
        {sellerProducts.length === 0 ? (
          <p className={styles.emptyState}>No products listed yet.</p>
        ) : (
          <div className={styles.grid}>
            {sellerProducts.map((product) => {
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
    </section>
  );
}
