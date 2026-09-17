import { API_URL, parseApiResponse, authHeaders } from "./client";

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  productTitle: string;
  productSlug: string;
  productPrice: number;
  productImage: string | null;
  productStock: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
}

export async function getCart(token: string): Promise<Cart> {
  const res = await fetch(`${API_URL}/cart`, {
    headers: authHeaders(token),
    cache: "no-store",
  });
  return parseApiResponse<Cart>(res);
}

export async function addToCart(productId: string, quantity: number, token: string): Promise<Cart> {
  const res = await fetch(`${API_URL}/cart/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify({ productId, quantity }),
  });
  return parseApiResponse<Cart>(res);
}

export async function updateCartItem(productId: string, quantity: number, token: string): Promise<Cart> {
  const res = await fetch(`${API_URL}/cart/items/${productId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify({ quantity }),
  });
  return parseApiResponse<Cart>(res);
}

export async function removeFromCart(productId: string, token: string): Promise<Cart> {
  const res = await fetch(`${API_URL}/cart/items/${productId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  return parseApiResponse<Cart>(res);
}