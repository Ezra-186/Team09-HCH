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
  author: string;
  rating: number;
  comment: string;
  date: string;
};
