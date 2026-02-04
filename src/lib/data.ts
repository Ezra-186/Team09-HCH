import { products, sellers } from './seed';
import { Product, Seller } from './types';

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
