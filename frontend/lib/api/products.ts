import { API_URL, parseApiResponse } from "./client";
import { Product } from "@/types/product";

export async function getProducts(filters: ProductFilters = {}): Promise<PaginatedProducts> {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.category) params.set("category", filters.category);
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.page) params.set("page", String(filters.page));

  const res = await fetch(`${API_URL}/products?${params.toString()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch products");

  const json = await res.json();
  if (!json.success) throw new Error(json.error.message);
  return json;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const res = await fetch(`${API_URL}/products/slug/${slug}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch product");
  return parseApiResponse<Product>(res);
}

export async function createProduct(
  input: { title: string; slug: string; price: number; stock: number; categoryId: string },
  token: string
): Promise<Product> {
  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(input),
  });
  return parseApiResponse<Product>(res);
}

export interface ProductFilters {
  search?: string;
  category?: string;
  sort?: string;
  page?: number;
}

export interface PaginatedProducts {
  data: Product[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

