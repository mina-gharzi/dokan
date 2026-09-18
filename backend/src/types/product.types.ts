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


export type ProductSort = "price_asc" | "price_desc" | "newest" | "oldest";

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  sort?: ProductSort;
  page: number;
  limit: number;
}

export interface PaginatedProducts {
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}