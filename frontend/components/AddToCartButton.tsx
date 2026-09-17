"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { addToCart } from "@/lib/api";

export function AddToCartButton({ productId }: { productId: string }) {
  const { token, user } = useAuth();
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleClick() {
    if (!user || !token) {
      router.push("/login");
      return;
    }

    setIsAdding(true);
    setMessage(null);

    try {
      await addToCart(productId, 1, token);
      setMessage("Added to cart!");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={isAdding}
        className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 disabled:opacity-50"
      >
        {isAdding ? "Adding..." : "Add to Cart"}
      </button>
      {message && <p className="text-sm mt-2 text-gray-600">{message}</p>}
    </div>
  );
}