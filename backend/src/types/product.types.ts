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

export type CreateProductInput = {
  title: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
  categoryId: string;
  sellerId: string;
};

export type UpdateProductInput = Partial<
  Omit<CreateProductInput, "sellerId">
>;