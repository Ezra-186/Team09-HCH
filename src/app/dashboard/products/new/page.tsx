import Link from 'next/link';
import { createProductAction } from '@/app/dashboard/actions';
import { PRODUCT_CATEGORIES } from '@/lib/products';
import styles from '../form.module.css';

type NewProductPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

export const dynamic = 'force-dynamic';

export default async function NewProductPage({ searchParams }: NewProductPageProps) {
  const sp = (await searchParams) ?? {};

  return (
    <section className={styles.page}>
      <h1>Create Product</h1>
      {sp.error ? <p className={styles.error}>{sp.error}</p> : null}

      <form action={createProductAction} className={styles.form}>
        <label className={styles.field}>
          <span>Title</span>
          <input name="title" required className={styles.input} />
        </label>

        <label className={styles.field}>
          <span>Description</span>
          <textarea name="description" className={styles.textarea} />
        </label>

        <label className={styles.field}>
          <span>Price</span>
          <input name="price" type="number" min="0.01" step="0.01" required className={styles.input} />
        </label>

        <label className={styles.field}>
          <span>Category</span>
          <select name="category" className={styles.input} defaultValue="General">
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>Image URL</span>
          <input name="image_url" type="url" className={styles.input} />
        </label>

        <div className={styles.actions}>
          <button type="submit" className={styles.submit}>
            Save Product
          </button>
          <Link href="/dashboard" className={styles.cancel}>
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}
