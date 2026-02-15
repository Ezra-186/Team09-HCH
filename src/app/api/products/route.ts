import { NextRequest, NextResponse } from 'next/server';
import { SELLER_SESSION_COOKIE, readSellerIdFromSession } from '@/lib/auth';
import {
  createProductForSeller,
  getProductsFromDb,
  isValidProductCategory,
  normalizeProductCategory,
  PRODUCT_CATEGORIES,
} from '@/lib/products';
import { Product } from '@/lib/types';

function getSellerIdFromRequest(request: NextRequest): string | null {
  const value = request.cookies.get(SELLER_SESSION_COOKIE)?.value;
  return readSellerIdFromSession(value);
}

export async function GET(): Promise<NextResponse<Product[]>> {
  const products = await getProductsFromDb();
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const sellerId = getSellerIdFromRequest(request);

  if (!sellerId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const payload = (await request.json()) as {
    title?: unknown;
    description?: unknown;
    price?: unknown;
    image_url?: unknown;
    category?: unknown;
  };

  const title = typeof payload.title === 'string' ? payload.title.trim() : '';
  const description = typeof payload.description === 'string' ? payload.description.trim() : '';
  const imageUrl = typeof payload.image_url === 'string' ? payload.image_url.trim() : '';
  const price = Number(payload.price);
  const rawCategory = typeof payload.category === 'string' ? payload.category.trim() : '';
  const category = normalizeProductCategory(rawCategory);

  if (!title || !Number.isFinite(price) || price <= 0) {
    return NextResponse.json({ message: 'Invalid product payload' }, { status: 400 });
  }

  if (rawCategory && !isValidProductCategory(rawCategory)) {
    return NextResponse.json({ message: `Category must be one of: ${PRODUCT_CATEGORIES.join(', ')}` }, { status: 400 });
  }

  const id = await createProductForSeller({
    sellerId,
    title,
    description,
    price,
    imageUrl,
    category,
  });

  return NextResponse.json({ id }, { status: 201 });
}
