import { CreateProductInput } from "../schemas/product.schema";

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  image: string | null;
  categoryId: string;
  sellerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductRepositoryInput extends CreateProductInput {
  sellerId: string;
}