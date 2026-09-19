import { API_URL, parseApiResponse, withCredentials } from "./client";

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

export async function getCart(): Promise<Cart> {
  const res = await fetch(`${API_URL}/cart`, {
    cache: "no-store",
    ...withCredentials,
  });
  return parseApiResponse<Cart>(res);
}

export async function addToCart(productId: string, quantity: number): Promise<Cart> {
  const res = await fetch(`${API_URL}/cart/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, quantity }),
    ...withCredentials,
  });
  return parseApiResponse<Cart>(res);
}

export async function updateCartItem(productId: string, quantity: number): Promise<Cart> {
  const res = await fetch(`${API_URL}/cart/items/${productId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity }),
    ...withCredentials,
  });
  return parseApiResponse<Cart>(res);
}

export async function removeFromCart(productId: string): Promise<Cart> {
  const res = await fetch(`${API_URL}/cart/items/${productId}`, {
    method: "DELETE",
    ...withCredentials,
  });
  return parseApiResponse<Cart>(res);
}