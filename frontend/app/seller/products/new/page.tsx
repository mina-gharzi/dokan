"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createProduct, uploadImage } from "@/lib/api";

export default function NewProductPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Loading اولیه: هنوز نمی‌دانیم کاربر Login کرده یا نه
  if (isLoading) {
    return <p className="text-center py-10">در حال بارگذاری...</p>;
  }

  // Protected Route ساده در سطح UX (نه امنیت واقعی — آن در Backend است)
  if (!user || (user.role !== "SELLER" && user.role !== "ADMIN")) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <p className="text-gray-600">برای دسترسی به این صفحه باید به‌عنوان فروشنده وارد شده باشی.</p>
      </main>
    );
  }

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      let imageUrl: string | undefined;

      // اول عکس رو آپلود می‌کنیم (اگه انتخاب شده باشه)، بعد با URL برگشتی محصول رو می‌سازیم
      if (imageFile) {
        setIsUploadingImage(true);
        imageUrl = await uploadImage(imageFile);
        setIsUploadingImage(false);
      }

      await createProduct({
        title,
        slug,
        price: Number(price),
        stock: Number(stock),
        categoryId,
        image: imageUrl,
      });
      router.push("/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "مشکلی پیش اومد");
    } finally {
      setIsSubmitting(false);
      setIsUploadingImage(false);
    }
  }

  return (
    <main className="min-h-screen px-4 py-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">ثبت محصول جدید</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
            {error}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">عکس محصول</label>
          {imagePreview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imagePreview}
              alt="پیش‌نمایش عکس محصول"
              className="w-full h-40 object-cover rounded-md border mb-2"
            />
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="w-full text-sm"
          />
          <p className="text-xs text-gray-400 mt-1">JPEG، PNG یا WebP، حداکثر ۵ مگابایت</p>
        </div>

        <input
          placeholder="عنوان"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
        />
        <input
          placeholder="اسلاگ (مثلاً gaming-mouse)"
          required
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
        />
        <input
          placeholder="قیمت (تومان)"
          type="number"
          required
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
        />
        <input
          placeholder="موجودی"
          type="number"
          required
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
        />
        <input
          placeholder="شناسه دسته‌بندی (UUID)"
          required
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 disabled:opacity-50"
        >
          {isUploadingImage
            ? "در حال آپلود عکس..."
            : isSubmitting
            ? "در حال ثبت..."
            : "ثبت محصول"}
        </button>
      </form>
    </main>
  );
}