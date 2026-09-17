import { API_URL, parseApiResponse, authHeaders } from "./client";

export interface OrderItem {
  id: string;
  productId: string;
  productTitle: string;
  quantity: number;
  priceAtPurchase: number;
}

export interface Order {
  id: string;
  customerId: string;
  status: string;
  total: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export async function checkout(token: string): Promise<Order> {
  const res = await fetch(`${API_URL}/orders/checkout`, {
    method: "POST",
    headers: authHeaders(token),
  });
  return parseApiResponse<Order>(res);
}

export async function getMyOrders(token: string): Promise<Order[]> {
  const res = await fetch(`${API_URL}/orders`, {
    headers: authHeaders(token),
    cache: "no-store",
  });
  return parseApiResponse<Order[]>(res);
}

export async function getOrderById(id: string, token: string): Promise<Order> {
  const res = await fetch(`${API_URL}/orders/${id}`, {
    headers: authHeaders(token),
    cache: "no-store",
  });
  return parseApiResponse<Order>(res);
}