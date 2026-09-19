import { API_URL, parseApiResponse, withCredentials } from "./client";

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
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    ...withCredentials,
  });
  return parseApiResponse<AuthResponse>(res);
}

export async function registerUser(name: string, email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
    ...withCredentials,
  });
  return parseApiResponse<AuthResponse>(res);
}

export async function getCurrentUser(): Promise<AuthUser> {
  const res = await fetch(`${API_URL}/auth/me`, { ...withCredentials, cache: "no-store" });
  const { user } = await parseApiResponse<AuthResponse>(res);
  return user;
}

export async function logoutUser(): Promise<void> {
  const res = await fetch(`${API_URL}/auth/logout`, { method: "POST", ...withCredentials });
  await parseApiResponse(res);
}