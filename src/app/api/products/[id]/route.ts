import { NextRequest, NextResponse } from 'next/server';
import { SELLER_SESSION_COOKIE, readSellerIdFromSession } from '@/lib/auth';
import {
  deleteProductForSeller,
  getProductByIdFromDb,
  isValidProductCategory,
  normalizeProductCategory,
  PRODUCT_CATEGORIES,
  updateProductForSeller,
} from '@/lib/products';
import { Product } from '@/lib/types';

function getSellerIdFromRequest(request: NextRequest): string | null {
  const value = request.cookies.get(SELLER_SESSION_COOKIE)?.value;
  return readSellerIdFromSession(value);
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<Product | { message: string }>> {
  const { id } = await params;
  const product = await getProductByIdFromDb(id);

  if (!product) {
    return NextResponse.json({ message: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const sellerId = getSellerIdFromRequest(request);
  if (!sellerId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const product = await getProductByIdFromDb(id);
  if (!product || product.sellerId !== sellerId) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
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

  await updateProductForSeller(id, sellerId, { title, description, price, imageUrl, category });
  return NextResponse.json({ message: 'ok' });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const sellerId = getSellerIdFromRequest(request);
  if (!sellerId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const deleted = await deleteProductForSeller(id, sellerId);

  if (!deleted) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json({ message: 'ok' });
}
