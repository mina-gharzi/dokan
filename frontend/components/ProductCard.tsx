import Link from "next/link";
import { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  const isOutOfStock = product.stock === 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow block"
    >
      <h2 className="font-semibold text-lg text-gray-900">{product.title}</h2>
      <p className="text-gray-500 text-sm mt-1">{product.price} تومان</p>
      {isOutOfStock ? (
        <span className="inline-block mt-2 text-xs text-red-600 font-medium">
          ناموجود
        </span>
      ) : (
        <span className="inline-block mt-2 text-xs text-green-600 font-medium">
          {product.stock} عدد موجود
        </span>
      )}
    </Link>
  );
}