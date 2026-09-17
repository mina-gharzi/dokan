import { Product } from "@/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

interface ApiErrorResponse {
  success: false;
  error: { code: string; message: string };
}

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/products`, {
    cache: "no-store", // فعلاً همیشه داده‌ی تازه بگیر؛ در فازهای بعد درباره‌ی Caching بیشتر صحبت می‌کنیم
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const json: ApiSuccessResponse<Product[]> | ApiErrorResponse = await res.json();

  if (!json.success) {
    throw new Error(json.error.message);
  }

  return json.data;
}