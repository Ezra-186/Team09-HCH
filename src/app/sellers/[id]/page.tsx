import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import {
  getAverageRatingForProduct,
  getProductsBySellerId,
  getReviewsByProductId,
  getSellerById,
} from '@/lib/data';

type SellerPageProps = {
  params: { id: string };
};

export default function SellerPage({ params }: SellerPageProps) {
  const seller = getSellerById(params.id);

  if (!seller) {
    return (
      <section style={{ display: 'grid', gap: '1rem' }}>
        <h1 style={{ fontSize: '1.6rem' }}>Seller not found</h1>
        <p style={{ color: '#4d001a' }}>
          That maker doesn&apos;t exist here yet. Head back to the catalog to keep exploring artisans.
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

  const sellerProducts = getProductsBySellerId(seller.id);

  return (
    <section style={{ display: 'grid', gap: '1.5rem' }}>
      <header style={{ display: 'grid', gap: '0.4rem' }}>
        <p style={{ letterSpacing: '0.08em', textTransform: 'uppercase', color: '#b59f71' }}>
          Maker
        </p>
        <h1 style={{ fontSize: '1.9rem' }}>{seller.name}</h1>
        <p style={{ color: '#4d001a' }}>{seller.location}</p>
        <p style={{ color: '#4d001a', maxWidth: '760px', lineHeight: 1.6 }}>{seller.bio}</p>
      </header>

      <div
        style={{
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        }}
      >
        {sellerProducts.length === 0 ? (
          <p style={{ color: '#4d001a' }}>
            This maker hasn&apos;t listed any products yet. Check back soon for new releases.
          </p>
        ) : (
          sellerProducts.map((product) => {
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
          })
        )}
      </div>
    </section>
  );
}
