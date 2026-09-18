import { API_URL, parseApiResponse, authHeaders } from "./client";

export interface Review {
  id: string;
  productId: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

interface ProductReviewsData {
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
}

export async function getProductReviews(productId: string): Promise<ProductReviewsData> {
  const res = await fetch(`${API_URL}/products/${productId}/reviews`, { cache: "no-store" });
  return parseApiResponse<ProductReviewsData>(res);
}

export async function createReview(
  productId: string,
  rating: number,
  comment: string | undefined,
  token: string
): Promise<Review> {
  const res = await fetch(`${API_URL}/products/${productId}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify({ rating, comment }),
  });
  return parseApiResponse<Review>(res);
}