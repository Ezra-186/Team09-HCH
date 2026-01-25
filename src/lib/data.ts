import { products, reviews, sellers } from './seed';
import { Product, Review, Seller } from './types';

export function getSellers(): Seller[] {
  return sellers;
}

export function getSellerById(id: string): Seller | undefined {
  return sellers.find((seller) => seller.id === id);
}

export function getProducts(): Product[] {
  return products;
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getProductsBySellerId(sellerId: string): Product[] {
  return products.filter((product) => product.sellerId === sellerId);
}

export function getReviewsByProductId(productId: string): Review[] {
  return reviews.filter((review) => review.productId === productId);
}

export function getAverageRatingForProduct(productId: string): number {
  const productReviews = getReviewsByProductId(productId);

  if (productReviews.length === 0) {
    return 0;
  }

  const total = productReviews.reduce((sum, review) => sum + review.rating, 0);
  return Number((total / productReviews.length).toFixed(1));
}
