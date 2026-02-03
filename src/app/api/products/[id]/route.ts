import { NextRequest, NextResponse } from 'next/server';
import { getProductById } from '@/lib/data';
import { Product } from '@/lib/types';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<Product | { message: string }>> {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return NextResponse.json({ message: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json(product);
}
