import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import styles from './seller.module.css';
import { getProductsBySellerId, getSellerById } from '@/lib/data';
import { getReviewStatsForProducts } from '@/lib/reviews';

type SellerPageProps = {
  params: Promise<{ id: string }>;
};

export default async function SellerPage({ params }: SellerPageProps) {
  const { id } = await params;
  const seller = getSellerById(id);

  if (!seller) {
    return (
      <section className={styles.emptyState}>
        <h1>Seller not found</h1>
        <p className={styles.location}>
          That maker doesn&apos;t exist here yet. Head back to the catalog to keep exploring artisans.
        </p>
        <Link href="/products" className={styles.backLink}>
          Back to products
        </Link>
      </section>
    );
  }

  const sellerProducts = getProductsBySellerId(seller.id);
  const reviewStats = await getReviewStatsForProducts(sellerProducts.map((product) => product.id));

  return (
    <section className={styles.page}>
      <header className={styles.headingGroup}>
        <p className={styles.eyebrow}>Maker</p>
        <h1 className={styles.title}>{seller.name}</h1>
        <p className={styles.location}>{seller.location}</p>
        <p className={styles.bio}>{seller.bio}</p>
      </header>

      <div className={styles.grid}>
        {sellerProducts.length === 0 ? (
          <p className={styles.location}>
            This maker hasn&apos;t listed any products yet. Check back soon for new releases.
          </p>
        ) : (
          sellerProducts.map((product) => {
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
          })
        )}
      </div>
    </section>
  );
}
