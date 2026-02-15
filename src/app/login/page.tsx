import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAuthenticatedSellerId } from '@/lib/auth';
import { getSellersFromDb } from '@/lib/sellers';
import { loginSeller } from './actions';
import styles from './page.module.css';

type LoginPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

const errorMessages: Record<string, string> = {
  missing_fields: 'Seller and password are required.',
  invalid_credentials: 'Invalid seller or password.',
};

export const dynamic = 'force-dynamic';

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const authenticatedSellerId = await getAuthenticatedSellerId();
  if (authenticatedSellerId) {
    redirect('/dashboard');
  }

  const sellers = await getSellersFromDb();
  const sp = (await searchParams) ?? {};
  const errorMessage = sp.error ? errorMessages[sp.error] ?? 'Unable to sign in.' : null;

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Seller Access</p>
        <h1 className={styles.title}>Login</h1>
        <p className={styles.subtitle}>Sign in to manage your products and respond to reviews.</p>
      </header>

      <form action={loginSeller} className={styles.form}>
        <label className={styles.field}>
          <span>Seller</span>
          <select name="sellerId" required className={styles.input} defaultValue="">
            <option value="" disabled>
              Select your seller profile
            </option>
            {sellers.map((seller) => (
              <option key={seller.id} value={seller.id}>
                {seller.name} ({seller.id})
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>Password</span>
          <input name="password" type="password" required className={styles.input} autoComplete="current-password" />
        </label>

        {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}

        <button type="submit" className={styles.submit}>
          Login
        </button>
      </form>

      <p className={styles.help}>
        Back to <Link href="/products">products</Link>
      </p>
    </section>
  );
}
