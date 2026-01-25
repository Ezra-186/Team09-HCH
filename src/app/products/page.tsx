import ProductCard from '@/components/ProductCard';
import { getAverageRatingForProduct, getProducts, getReviewsByProductId, getSellers } from '@/lib/data';

export default function ProductsPage() {
  const products = getProducts();
  const sellers = getSellers();
  const sellerById = new Map(sellers.map((seller) => [seller.id, seller]));

  return (
    <section style={{ display: 'grid', gap: '1.5rem' }}>
      <header style={{ display: 'grid', gap: '0.4rem' }}>
        <p style={{ letterSpacing: '0.08em', textTransform: 'uppercase', color: '#b59f71' }}>
          Catalog
        </p>
        <h1 style={{ fontSize: '1.8rem' }}>Featured pieces</h1>
        <p style={{ color: '#4d001a', maxWidth: '760px' }}>
          Hand-selected goods from independent makers. Browse by category or explore each seller&apos;s
          collection.
        </p>
      </header>

      <div
        style={{
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        }}
      >
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
