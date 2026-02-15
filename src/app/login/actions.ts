'use server';

import { redirect } from 'next/navigation';
import bcrypt from 'bcrypt';
import { clearAuthenticatedSellerSession, setAuthenticatedSellerSession } from '@/lib/auth';
import { getSellerAuthByIdFromDb } from '@/lib/sellers';

export async function loginSeller(formData: FormData): Promise<void> {
  const sellerId = String(formData.get('sellerId') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!sellerId || !password) {
    redirect('/login?error=missing_fields');
  }

  const seller = await getSellerAuthByIdFromDb(sellerId);
  if (!seller || !seller.password_hash) {
    redirect('/login?error=invalid_credentials');
  }

  const validPassword = await bcrypt.compare(password, seller.password_hash);
  if (!validPassword) {
    redirect('/login?error=invalid_credentials');
  }

  await setAuthenticatedSellerSession(seller.id);
  redirect('/dashboard');
}

export async function logoutSeller(): Promise<void> {
  await clearAuthenticatedSellerSession();
  redirect('/login');
}
