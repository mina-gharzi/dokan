export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: { code: string; message: string };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// یک تابع کمکی مشترک برای Parse کردن و بررسی خطای هر Response — از تکرار if(!json.success) در هر تابع جلوگیری می‌کند
export async function parseApiResponse<T>(res: Response): Promise<T> {
  const json: ApiResponse<T> = await res.json();

  if (!json.success) {
    throw new Error(json.error.message);
  }

  return json.data;
}

// توکن دیگر دست‌ما نیست (در httpOnly Cookie است)؛ مرورگر خودش با credentials: "include" آن را می‌فرستد
export const withCredentials: RequestInit = { credentials: "include" };