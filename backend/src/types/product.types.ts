export interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  stock: number;
}

export type CreateProductInput = Omit<Product, "id">;
export type UpdateProductInput = Partial<CreateProductInput>;