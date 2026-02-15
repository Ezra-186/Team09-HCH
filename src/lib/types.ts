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
  category: string | null;
  price: number;
  imageUrl?: string | null;
  imageSourceUrl?: string | null;
  status?: string | null;
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
