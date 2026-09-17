import { API_URL, parseApiResponse } from "./client";
import { Product } from "@/types/product";

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/products`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch products");
  return parseApiResponse<Product[]>(res);
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