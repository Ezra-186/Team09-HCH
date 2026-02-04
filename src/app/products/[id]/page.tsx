import Link from 'next/link';
import RatingStars from '@/components/RatingStars';
import styles from './product-detail.module.css';
import { getProductById, getSellerById } from '@/lib/data';
import { fetchReviewsByProductId } from '@/lib/reviews';

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return (
      <section className={styles.emptyState}>
        <h1>Product not found</h1>
        <p className={styles.muted}>
          We couldn&apos;t find that item. Browse the full catalog to discover more handcrafted goods.
        </p>
        <Link href="/products" className={styles.backLink}>
          Back to products
        </Link>
      </section>
    );
  }

  const seller = getSellerById(product.sellerId);
  const reviews = await fetchReviewsByProductId(product.id);
  const reviewCount = reviews.length;
  const averageRating =
    reviewCount === 0 ? 0 : Number((reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount).toFixed(1));

  return (
    <article className={styles.page}>
      <header className={styles.contentBlock}>
        <p className={styles.eyebrow}>{product.category}</p>
        <h1 className={styles.title}>{product.name}</h1>
        <p className={styles.description}>{product.description}</p>
        <div className={styles.priceRow}>
          <RatingStars rating={averageRating} count={reviewCount} />
          <span className={styles.price}>${product.price.toFixed(2)}</span>
        </div>
      </header>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Maker</h2>
        {seller ? (
          <div>
            <Link href={`/sellers/${seller.id}`} className={styles.sellerName}>
              {seller.name}
            </Link>
            <p className={styles.muted}>{seller.location}</p>
            <p className={styles.description}>{seller.bio}</p>
          </div>
        ) : (
          <p className={styles.muted}>Seller details are currently unavailable.</p>
        )}
      </section>

      <section className={styles.contentBlock}>
        <h2 className={styles.cardTitle}>Reviews</h2>
        {reviews.length === 0 ? (
          <p className={styles.muted}>No reviews yet. Be the first to share your thoughts.</p>
        ) : (
          <ul className={styles.reviews}>
            {reviews.map((review) => (
              <li key={review.id} className={styles.review}>
                <div className={styles.reviewHeader}>
                  <strong>{review.authorName}</strong>
                  <span className={styles.reviewDate}>{dateFormatter.format(new Date(review.createdAt))}</span>
                </div>
                <div>
                  <RatingStars rating={review.rating} />
                </div>
                <p className={styles.description}>{review.comment}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}
