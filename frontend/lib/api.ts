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
    cache: "no-store",
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

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const res = await fetch(`${API_URL}/products/slug/${slug}`, {
    cache: "no-store",
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }

  const json: ApiSuccessResponse<Product> | ApiErrorResponse = await res.json();

  if (!json.success) {
    throw new Error(json.error.message);
  }

  return json.data;
}
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "SELLER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  user: AuthUser;
  token: string;
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const json: ApiSuccessResponse<AuthResponse> | ApiErrorResponse = await res.json();

  if (!json.success) {
    throw new Error(json.error.message);
  }

  return json.data;
}

export async function createProduct(
  input: {
    title: string;
    slug: string;
    price: number;
    stock: number;
    categoryId: string;
  },
  token: string
) {
  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });

  const json: ApiSuccessResponse<Product> | ApiErrorResponse = await res.json();

  if (!json.success) {
    throw new Error(json.error.message);
  }

  return json.data;
}