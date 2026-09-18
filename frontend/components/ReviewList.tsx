import { Review } from "@/lib/api";

export function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <p className="text-gray-500 text-sm">No reviews yet.</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="border-b pb-3">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">{review.customerName}</span>
            <span className="text-yellow-500 text-sm">{"★".repeat(review.rating)}</span>
          </div>
          {review.comment && <p className="text-gray-600 text-sm mt-1">{review.comment}</p>}
        </div>
      ))}
    </div>
  );
}