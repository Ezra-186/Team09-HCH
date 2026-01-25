import ProductCard from '@/components/ProductCard';
import styles from './products.module.css';
import { getAverageRatingForProduct, getProducts, getReviewsByProductId, getSellers } from '@/lib/data';

export default function ProductsPage() {
  const products = getProducts();
  const sellers = getSellers();
  const sellerById = new Map(sellers.map((seller) => [seller.id, seller]));

  return (
    <section className={styles.page}>
      <header className={styles.headingGroup}>
        <p className={styles.eyebrow}>Catalog</p>
        <h1 className={styles.title}>Featured pieces</h1>
        <p className={styles.subtitle}>
          Hand-selected goods from independent makers. Browse by category or explore each seller&apos;s collection.
        </p>
      </header>

      <div className={styles.grid}>
        {products.map((product) => {
          const seller = sellerById.get(product.sellerId);
          if (!seller) {
            return null;
          }

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
    </section>
  );
}
