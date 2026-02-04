export type Seller = {
  id: string;
  name: string;
  location: string;
  bio: string;
};

export type Product = {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  category: string;
  price: number;
};

export type Review = {
  id: string;
  productId: string;
  authorName: string;
  rating: number;
  comment: string;
  title?: string | null;
  createdAt: string;
};
