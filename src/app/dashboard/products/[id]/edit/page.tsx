import Link from 'next/link';
import { redirect } from 'next/navigation';
import { updateProductAction } from '@/app/dashboard/actions';
import { getAuthenticatedSellerId } from '@/lib/auth';
import { getProductByIdFromDb, PRODUCT_CATEGORIES } from '@/lib/products';
import styles from '../../form.module.css';

type EditProductPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string }>;
};

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params, searchParams }: EditProductPageProps) {
  const sellerId = await getAuthenticatedSellerId();
  if (!sellerId) {
    redirect('/login');
  }

  const { id } = await params;
  const product = await getProductByIdFromDb(id);

  if (!product || product.sellerId !== sellerId) {
    redirect('/dashboard?error=forbidden');
  }

  const sp = (await searchParams) ?? {};

  return (
    <section className={styles.page}>
      <h1>Edit Product</h1>
      {sp.error ? <p className={styles.error}>{sp.error}</p> : null}

      <form action={updateProductAction.bind(null, id)} className={styles.form}>
        <label className={styles.field}>
          <span>Title</span>
          <input name="title" required className={styles.input} defaultValue={product.name} />
        </label>

        <label className={styles.field}>
          <span>Description</span>
          <textarea name="description" className={styles.textarea} defaultValue={product.description} />
        </label>

        <label className={styles.field}>
          <span>Price</span>
          <input
            name="price"
            type="number"
            min="0.01"
            step="0.01"
            required
            className={styles.input}
            defaultValue={product.price.toFixed(2)}
          />
        </label>

        <label className={styles.field}>
          <span>Category</span>
          <select name="category" className={styles.input} defaultValue={product.category ?? 'General'}>
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>Image URL</span>
          <input name="image_url" type="url" className={styles.input} defaultValue={product.imageUrl ?? ''} />
        </label>

        <div className={styles.actions}>
          <button type="submit" className={styles.submit}>
            Update Product
          </button>
          <Link href="/dashboard" className={styles.cancel}>
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}
