"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createProduct } from "@/lib/api";

export default function NewProductPage() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Loading اولیه: هنوز نمی‌دانیم کاربر Login کرده یا نه
  if (isLoading) {
    return <p className="text-center py-10">Loading...</p>;
  }

  // Protected Route ساده در سطح UX (نه امنیت واقعی — آن در Backend است)
  if (!user || !token || (user.role !== "SELLER" && user.role !== "ADMIN")) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <p className="text-gray-600">You must be logged in as a Seller to access this page.</p>
      </main>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await createProduct(
        {
          title,
          slug,
          price: Number(price),
          stock: Number(stock),
          categoryId,
        },
        token!
      );
      router.push("/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen px-4 py-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create a Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
            {error}
          </p>
        )}

        <input
          placeholder="Title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
        />
        <input
          placeholder="Slug (e.g. gaming-mouse)"
          required
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
        />
        <input
          placeholder="Price"
          type="number"
          required
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
        />
        <input
          placeholder="Stock"
          type="number"
          required
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
        />
        <input
          placeholder="Category ID (UUID)"
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
          {isSubmitting ? "Creating..." : "Create Product"}
        </button>
      </form>
    </main>
  );
}