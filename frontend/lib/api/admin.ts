import { API_URL, withCredentials } from "./client";

interface PaginatedResponse<T> {
  data: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface AdminOrder {
  id: string;
  customer_name: string;
  customer_email: string;
  status: string;
  total: string;
  created_at: string;
}

export async function getAdminUsers(page = 1): Promise<PaginatedResponse<AdminUser>> {
  const res = await fetch(`${API_URL}/admin/users?page=${page}`, {
    cache: "no-store",
    ...withCredentials,
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error.message);
  return json;
}

export async function updateUserRole(userId: string, role: string) {
  const res = await fetch(`${API_URL}/admin/users/${userId}/role`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
    ...withCredentials,
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error.message);
  return json.data;
}

export async function getAdminOrders(page = 1): Promise<PaginatedResponse<AdminOrder>> {
  const res = await fetch(`${API_URL}/admin/orders?page=${page}`, {
    cache: "no-store",
    ...withCredentials,
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error.message);
  return json;
}

export async function updateOrderStatus(orderId: string, status: string) {
  const res = await fetch(`${API_URL}/admin/orders/${orderId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
    ...withCredentials,
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error.message);
  return json.data;
}