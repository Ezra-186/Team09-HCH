import Link from 'next/link';
import RatingStars from './RatingStars';
import { Product, Seller } from '../lib/types';

type ProductCardProps = {
  product: Product;
  seller: Seller;
  averageRating?: number;
  reviewCount?: number;
  href?: string;
};

export default function ProductCard({
  product,
  seller,
  averageRating = 0,
  reviewCount = 0,
  href,
}: ProductCardProps) {
  return (
    <article
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        padding: '1rem',
        border: '1px solid #b59f71',
        borderRadius: '10px',
        background: '#fff8f2',
        minHeight: '100%',
        boxShadow: '0 6px 20px rgba(128, 0, 42, 0.05)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        <p style={{ fontSize: '0.85rem', letterSpacing: '0.02em', color: '#b59f71' }}>
          {product.category}
        </p>
        <h3 style={{ fontSize: '1.15rem', lineHeight: 1.3 }}>
          <Link href={href ?? `/products/${product.id}`} style={{ color: '#80002a' }}>
            {product.name}
          </Link>
        </h3>
        <p style={{ fontSize: '0.95rem', color: '#4d001a', lineHeight: 1.5 }}>
          {product.description}
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem',
          borderTop: '1px solid #f1e3d3',
          paddingTop: '0.75rem',
        }}
      >
        <RatingStars rating={averageRating} count={reviewCount} />
        <p style={{ fontSize: '0.95rem', color: '#4d001a' }}>
          By{' '}
          <Link href={`/sellers/${seller.id}`} style={{ fontWeight: 600 }}>
            {seller.name}
          </Link>
        </p>
        <p style={{ fontSize: '1rem', fontWeight: 700, color: '#80002a' }}>
          ${product.price.toFixed(2)}
        </p>
      </div>
    </article>
  );
}
