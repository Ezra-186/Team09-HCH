import Link from 'next/link';
import RatingStars from '@/components/RatingStars';
import {
  getAverageRatingForProduct,
  getProductById,
  getReviewsByProductId,
  getSellerById,
} from '@/lib/data';

type ProductPageProps = {
  params: { id: string };
};

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

export default function ProductDetailPage({ params }: ProductPageProps) {
  const product = getProductById(params.id);

  if (!product) {
    return (
      <section style={{ display: 'grid', gap: '1rem' }}>
        <h1 style={{ fontSize: '1.6rem' }}>Product not found</h1>
        <p style={{ color: '#4d001a' }}>
          We couldn&apos;t find that item. Browse the full catalog to discover more handcrafted goods.
        </p>
        <Link
          href="/products"
          style={{
            padding: '0.85rem 1.2rem',
            borderRadius: '10px',
            border: '1px solid #b59f71',
            width: 'fit-content',
            fontWeight: 600,
          }}
        >
          Back to products
        </Link>
      </section>
    );
  }

  const seller = getSellerById(product.sellerId);
  const reviews = getReviewsByProductId(product.id);
  const averageRating = getAverageRatingForProduct(product.id);

  return (
    <article style={{ display: 'grid', gap: '1.5rem', maxWidth: '860px' }}>
      <header style={{ display: 'grid', gap: '0.5rem' }}>
        <p style={{ letterSpacing: '0.08em', textTransform: 'uppercase', color: '#b59f71' }}>
          {product.category}
        </p>
        <h1 style={{ fontSize: '2rem', lineHeight: 1.2 }}>{product.name}</h1>
        <p style={{ fontSize: '1.05rem', color: '#4d001a', lineHeight: 1.6 }}>
          {product.description}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <RatingStars rating={averageRating} count={reviews.length} />
          <span style={{ fontWeight: 700, color: '#80002a' }}>${product.price.toFixed(2)}</span>
        </div>
      </header>

      <section
        style={{
          border: '1px solid #f1e3d3',
          borderRadius: '12px',
          padding: '1rem',
          background: '#fffdf8',
        }}
      >
        <h2 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>Maker</h2>
        {seller ? (
          <div style={{ display: 'grid', gap: '0.25rem' }}>
            <Link href={`/sellers/${seller.id}`} style={{ fontWeight: 700 }}>
              {seller.name}
            </Link>
            <p style={{ color: '#4d001a' }}>{seller.location}</p>
            <p style={{ color: '#4d001a', lineHeight: 1.5 }}>{seller.bio}</p>
          </div>
        ) : (
          <p style={{ color: '#4d001a' }}>Seller details are currently unavailable.</p>
        )}
      </section>

      <section style={{ display: 'grid', gap: '0.75rem' }}>
        <h2 style={{ fontSize: '1.2rem' }}>Reviews</h2>
        {reviews.length === 0 ? (
          <p style={{ color: '#4d001a' }}>No reviews yet. Be the first to share your thoughts.</p>
        ) : (
          <ul style={{ listStyle: 'none', display: 'grid', gap: '0.75rem', padding: 0 }}>
            {reviews.map((review) => (
              <li
                key={review.id}
                style={{
                  border: '1px solid #f1e3d3',
                  borderRadius: '10px',
                  padding: '0.85rem',
                  background: '#fff',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                  }}
                >
                  <strong>{review.author}</strong>
                  <span style={{ color: '#4d001a', fontSize: '0.9rem' }}>
                    {dateFormatter.format(new Date(review.date))}
                  </span>
                </div>
                <div style={{ margin: '0.35rem 0' }}>
                  <RatingStars rating={review.rating} />
                </div>
                <p style={{ color: '#4d001a', lineHeight: 1.5 }}>{review.comment}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}
