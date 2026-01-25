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
    <article className={`${styles.card} ${className ?? ''}`}>
      <div className={styles.content}>
        <p className={styles.category}>{product.category}</p>
        <h3 className={styles.title}>
          <Link href={href ?? `/products/${product.id}`} className={styles.titleLink}>
            {product.name}
          </Link>
        </h3>
        <p className={styles.description}>{product.description}</p>
      </div>

      <div className={styles.meta}>
        <RatingStars rating={averageRating} count={reviewCount} />
        <p className={styles.seller}>
          By{' '}
          <Link href={`/sellers/${seller.id}`} className={styles.sellerLink}>
            {seller.name}
          </Link>
        </p>
        <p className={styles.price}>${product.price.toFixed(2)}</p>
      </div>
    </article>
  );
}
