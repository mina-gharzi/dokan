import { API_URL, parseApiResponse, withCredentials } from "./client";

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_URL}/uploads`, {
    method: "POST",
    body: formData,
    // توجه: Content-Type رو دستی ست نمی‌کنیم — مرورگر خودش boundary درست multipart رو می‌سازه
    ...withCredentials,
  });

  const { url } = await parseApiResponse<{ url: string }>(res);
  return url;
}