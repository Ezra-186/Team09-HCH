import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/data';
import { Product } from '@/lib/types';

export async function GET(): Promise<NextResponse<Product[]>> {
  const products = getProducts();
  return NextResponse.json(products);
}
