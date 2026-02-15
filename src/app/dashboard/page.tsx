import Link from 'next/link';
import { redirect } from 'next/navigation';
import DeleteProductButton from '@/components/DeleteProductButton';
import { getAuthenticatedSellerId } from '@/lib/auth';
import { getProductsBySellerIdFromDb } from '@/lib/products';
import { getReviewStatsForProducts } from '@/lib/reviews';
import { getSellerByIdFromDb } from '@/lib/sellers';
import { logoutSeller } from '@/app/login/actions';
import { deleteProductAction } from './actions';
import styles from './page.module.css';

type DashboardPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

const errorMessages: Record<string, string> = {
  forbidden: 'You are not authorized to modify that product.',
};

export const dynamic = 'force-dynamic';

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const sellerId = await getAuthenticatedSellerId();
  if (!sellerId) {
    redirect('/login');
  }

  const [seller, products, sp] = await Promise.all([
    getSellerByIdFromDb(sellerId),
    getProductsBySellerIdFromDb(sellerId),
    searchParams,
  ]);

  if (!seller) {
    redirect('/login?error=invalid_credentials');
  }

  const reviewStats = await getReviewStatsForProducts(products.map((product) => product.id));
  const error = sp?.error ? errorMessages[sp.error] ?? 'Dashboard action failed.' : null;

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Seller Dashboard</p>
          <h1 className={styles.title}>{seller.name}</h1>
          <p className={styles.subtitle}>Manage your product listings.</p>
        </div>
        <div className={styles.headerActions}>
          <Link href="/dashboard/products/new" className={styles.primaryLink}>
            Create Product
          </Link>
          <form action={logoutSeller}>
            <button type="submit" className={styles.secondaryButton}>
              Logout
            </button>
          </form>
        </div>
      </header>

      {error ? <p className={styles.error}>{error}</p> : null}

      {products.length === 0 ? (
        <p className={styles.empty}>No products yet. Use Create Product to publish your first listing.</p>
      ) : (
        <div className={styles.list}>
          {products.map((product) => {
            const stats = reviewStats.get(product.id) ?? { average: 0, count: 0 };

            return (
              <article key={product.id} className={styles.item}>
                <div className={styles.itemMain}>
                  <h2>{product.name}</h2>
                  <p>${product.price.toFixed(2)}</p>
                  <p>Status: {product.status ?? 'n/a'}</p>
                  <p>
                    Rating: {stats.average.toFixed(1)} ({stats.count})
                  </p>
                </div>
                <div className={styles.itemActions}>
                  <Link href={`/dashboard/products/${product.id}/edit`} className={styles.editLink}>
                    Edit
                  </Link>
                  <DeleteProductButton action={deleteProductAction.bind(null, product.id)} />
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
