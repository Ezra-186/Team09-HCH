'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getAuthenticatedSellerId } from '@/lib/auth';
import {
  createProductForSeller,
  deleteProductForSeller,
  getProductByIdFromDb,
  isValidProductCategory,
  normalizeProductCategory,
  PRODUCT_CATEGORIES,
  updateProductForSeller,
} from '@/lib/products';

function parseAndValidateProductForm(formData: FormData): {
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  category: ReturnType<typeof normalizeProductCategory>;
} {
  const title = String(formData.get('title') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const imageUrl = String(formData.get('image_url') ?? '').trim();
  const rawCategory = String(formData.get('category') ?? '').trim();
  const category = normalizeProductCategory(rawCategory);
  const rawPrice = String(formData.get('price') ?? '').trim();
  const price = Number(rawPrice);

  if (!title) {
    throw new Error('Title is required.');
  }

  if (!Number.isFinite(price) || price <= 0) {
    throw new Error('Price must be a number greater than 0.');
  }

  if (rawCategory && !isValidProductCategory(rawCategory)) {
    throw new Error(`Category must be one of: ${PRODUCT_CATEGORIES.join(', ')}.`);
  }

  return { title, description, imageUrl, price, category };
}

async function requireAuthenticatedSeller(): Promise<string> {
  const sellerId = await getAuthenticatedSellerId();
  if (!sellerId) {
    redirect('/login');
  }

  return sellerId;
}

export async function createProductAction(formData: FormData): Promise<void> {
  const sellerId = await requireAuthenticatedSeller();

  try {
    const input = parseAndValidateProductForm(formData);
    await createProductForSeller({ sellerId, ...input });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create product.';
    redirect(`/dashboard/products/new?error=${encodeURIComponent(message)}`);
  }

  revalidatePath('/dashboard');
  revalidatePath('/products');
  redirect('/dashboard');
}

export async function updateProductAction(productId: string, formData: FormData): Promise<void> {
  const sellerId = await requireAuthenticatedSeller();

  const existing = await getProductByIdFromDb(productId);
  if (!existing || existing.sellerId !== sellerId) {
    redirect('/dashboard?error=forbidden');
  }

  try {
    const input = parseAndValidateProductForm(formData);
    const updated = await updateProductForSeller(productId, sellerId, input);

    if (!updated) {
      redirect('/dashboard?error=forbidden');
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to update product.';
    redirect(`/dashboard/products/${productId}/edit?error=${encodeURIComponent(message)}`);
  }

  revalidatePath('/dashboard');
  revalidatePath('/products');
  revalidatePath(`/products/${productId}`);
  redirect('/dashboard');
}

export async function deleteProductAction(productId: string): Promise<void> {
  const sellerId = await requireAuthenticatedSeller();
  const deleted = await deleteProductForSeller(productId, sellerId);

  if (!deleted) {
    redirect('/dashboard?error=forbidden');
  }

  revalidatePath('/dashboard');
  revalidatePath('/products');
  redirect('/dashboard');
}
