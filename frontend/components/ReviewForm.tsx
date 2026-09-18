"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createReview } from "@/lib/api";

export function ReviewForm({ productId, onSuccess }: { productId: string; onSuccess: () => void }) {
  const { token, user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user || !token) {
    return <p className="text-sm text-gray-500">Please log in to leave a review.</p>;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await createReview(productId, rating, comment || undefined, token!);
      setComment("");
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
          {error}
        </p>
      )}

      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="border rounded-md px-3 py-2"
      >
        {[5, 4, 3, 2, 1].map((n) => (
          <option key={n} value={n}>
            {n} star{n > 1 ? "s" : ""}
          </option>
        ))}
      </select>

      <textarea
        placeholder="Write your review (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full border rounded-md px-3 py-2"
        rows={3}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}