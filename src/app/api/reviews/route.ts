import { NextRequest, NextResponse } from 'next/server';
import { getProductByIdFromDb } from '@/lib/products';
import { createReview, fetchReviewsByProductId } from '@/lib/reviews';

function safeReturnPath(pathValue: string, fallback: string): string {
  if (!pathValue.startsWith('/')) {
    return fallback;
  }

  return pathValue;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');

  if (!productId) {
    return NextResponse.json({ message: 'productId is required' }, { status: 400 });
  }

  const reviews = await fetchReviewsByProductId(productId);
  return NextResponse.json(reviews);
}

export async function POST(request: NextRequest) {
  const contentType = request.headers.get('content-type') ?? '';
  const isForm = contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data');

  let productId = '';
  let returnTo = '';
  let rating = 0;
  let title = '';
  let comment = '';
  let authorName = '';

  if (isForm) {
    const formData = await request.formData();
    productId = String(formData.get('productId') ?? '').trim();
    returnTo = String(formData.get('returnTo') ?? '').trim();
    rating = Number(formData.get('rating'));
    title = String(formData.get('title') ?? '').trim();
    comment = String(formData.get('comment') ?? '').trim();
    authorName = String(formData.get('authorName') ?? '').trim();
  } else {
    const payload = (await request.json()) as {
      productId?: unknown;
      rating?: unknown;
      title?: unknown;
      comment?: unknown;
      authorName?: unknown;
    };

    productId = typeof payload.productId === 'string' ? payload.productId.trim() : '';
    rating = Number(payload.rating);
    title = typeof payload.title === 'string' ? payload.title.trim() : '';
    comment = typeof payload.comment === 'string' ? payload.comment.trim() : '';
    authorName = typeof payload.authorName === 'string' ? payload.authorName.trim() : '';
  }

  const isRatingInvalid = !Number.isFinite(rating) || rating < 1 || rating > 5;
  const isAuthorMissing = !authorName;
  const isCommentMissing = !comment;
  const errorMessage = !productId || isAuthorMissing || isCommentMissing || isRatingInvalid ? 'Invalid review payload.' : '';

  if (errorMessage) {
    if (isForm) {
      const target = safeReturnPath(returnTo, productId ? `/products/${productId}` : '/products');
      const url = new URL(target, request.url);
      const formErrorMessage = isRatingInvalid
        ? 'Rating must be between 1 and 5.'
        : isAuthorMissing
          ? 'Name is required.'
          : isCommentMissing
            ? 'Comment is required.'
            : errorMessage;
      url.searchParams.set('reviewError', formErrorMessage);
      return NextResponse.redirect(url, 303);
    }

    return NextResponse.json({ message: errorMessage }, { status: 400 });
  }

  const product = await getProductByIdFromDb(productId);
  if (!product) {
    if (isForm) {
      const url = new URL('/products', request.url);
      url.searchParams.set('reviewError', 'Product not found.');
      return NextResponse.redirect(url, 303);
    }

    return NextResponse.json({ message: 'Product not found.' }, { status: 404 });
  }

  await createReview({
    productId,
    rating,
    title,
    comment,
    authorName,
  });

  if (isForm) {
    const target = safeReturnPath(returnTo, `/products/${productId}`);
    const url = new URL(target, request.url);
    url.searchParams.set('reviewSuccess', 'Review submitted.');
    return NextResponse.redirect(url, 303);
  }

  return NextResponse.json({ message: 'ok' }, { status: 201 });
}
