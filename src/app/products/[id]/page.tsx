import Link from 'next/link';
import RatingStars from '@/components/RatingStars';
import styles from './product-detail.module.css';
import { getProductByIdFromDb } from '@/lib/products';
import { fetchReviewsByProductId } from '@/lib/reviews';
import { getSellerByIdFromDb } from '@/lib/sellers';

type ProductPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ reviewError?: string; reviewSuccess?: string }>;
};

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({ params, searchParams }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductByIdFromDb(id);
  const sp = (await searchParams) ?? {};

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

  const seller = await getSellerByIdFromDb(product.sellerId);
  const reviews = await fetchReviewsByProductId(product.id);
  const reviewCount = reviews.length;
  const averageRating =
    reviewCount === 0 ? 0 : Number((reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount).toFixed(1));

  return (
    <article className={styles.page}>
      <header className={styles.contentBlock}>
        <p className={styles.categoryBadge}>{product.category ?? 'General'}</p>
        <h1 className={styles.title}>{product.name}</h1>
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            className={styles.productImage}
            loading="lazy"
            decoding="async"
            width={1200}
            height={800}
          />
        ) : null}
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

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Leave a review</h2>
        {sp.reviewError ? (
          <p className={styles.error} role="alert">
            {sp.reviewError}
          </p>
        ) : null}
        {sp.reviewSuccess ? (
          <p className={styles.success} aria-live="polite">
            {sp.reviewSuccess}
          </p>
        ) : null}
        <form action="/api/reviews" method="post" className={styles.reviewForm}>
          <input type="hidden" name="productId" value={product.id} />
          <input type="hidden" name="returnTo" value={`/products/${product.id}`} />
          <label>
            Your name
            <input name="authorName" required className={styles.input} />
          </label>
          <label>
            Rating
            <select name="rating" required className={styles.input} defaultValue="5">
              <option value="5">5</option>
              <option value="4">4</option>
              <option value="3">3</option>
              <option value="2">2</option>
              <option value="1">1</option>
            </select>
          </label>
          <label>
            Title (optional)
            <input name="title" className={styles.input} />
          </label>
          <label>
            Comment
            <textarea name="comment" required className={styles.textarea} />
          </label>
          <button type="submit" className={styles.reviewButton}>
            Submit review
          </button>
        </form>
      </section>
    </article>
  );
}
