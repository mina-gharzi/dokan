import Link from "next/link";
import { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  const isOutOfStock = product.stock === 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow block"
    >
      <div className="aspect-square bg-gray-100">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
            بدون تصویر
          </div>
        )}
      </div>

      <div className="p-4">
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
      </div>
    </Link>
  );
}