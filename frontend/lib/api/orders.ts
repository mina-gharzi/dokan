import { API_URL, parseApiResponse, withCredentials } from "./client";

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

export async function checkout(): Promise<Order> {
  const res = await fetch(`${API_URL}/orders/checkout`, {
    method: "POST",
    ...withCredentials,
  });
  return parseApiResponse<Order>(res);
}

export async function getMyOrders(): Promise<Order[]> {
  const res = await fetch(`${API_URL}/orders`, {
    cache: "no-store",
    ...withCredentials,
  });
  return parseApiResponse<Order[]>(res);
}

export async function getOrderById(id: string): Promise<Order> {
  const res = await fetch(`${API_URL}/orders/${id}`, {
    cache: "no-store",
    ...withCredentials,
  });
  return parseApiResponse<Order>(res);
}