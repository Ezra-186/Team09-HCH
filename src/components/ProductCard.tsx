import Link from 'next/link';
import RatingStars from './RatingStars';
import { Product, Seller } from '../lib/types';
import styles from './ProductCard.module.css';

type ProductCardProps = {
  product: Product;
  seller: Seller;
  averageRating?: number;
  reviewCount?: number;
  href?: string;
  className?: string;
};

export default function ProductCard({
  product,
  seller,
  averageRating = 0,
  reviewCount = 0,
  href,
  className,
}: ProductCardProps) {
  return (
    <Link href={href ?? `/products/${product.id}`} className={`${styles.cardLink} ${className ?? ''}`}>
      <article className={styles.card}>
        <div className={styles.thumbnailWrap}>
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.imageUrl}
              alt={product.name}
              className={styles.thumbnail}
              loading="lazy"
              decoding="async"
              width={320}
              height={180}
            />
          ) : (
            <div className={styles.placeholder}>No image</div>
          )}
        </div>

        <div className={styles.content}>
          <p className={styles.categoryBadge}>{product.category ?? 'General'}</p>
          <h2 className={styles.title}>{product.name}</h2>
          <p className={styles.description}>{product.description}</p>
        </div>

        <div className={styles.meta}>
          <RatingStars rating={averageRating} count={reviewCount} />
          <p className={styles.seller}>By {seller.name}</p>
          <p className={styles.price}>${product.price.toFixed(2)}</p>
        </div>
      </article>
    </Link>
  );
}
