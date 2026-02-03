import { NextResponse } from 'next/server';
import { getProductById } from '@/lib/data';
import { Product } from '@/lib/types';

type Params = {
  params: {
    id: string;
  };
};

export async function GET({ params }: Params): Promise<NextResponse<Product | { message: string }>> {
  const product = getProductById(params.id);

  if (!product) {
    return NextResponse.json({ message: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json(product);
}
