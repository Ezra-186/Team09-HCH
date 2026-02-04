import { NextRequest, NextResponse } from 'next/server';
import { fetchReviewsByProductId } from '@/lib/reviews';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');

  if (!productId) {
    return NextResponse.json({ message: 'productId is required' }, { status: 400 });
  }

  const reviews = await fetchReviewsByProductId(productId);
  return NextResponse.json(reviews);
}
