import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/api";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "محصول پیدا نشد — دکان" };
  }

  return {
    title: `${product.title} — دکان`,
    description: product.description ?? undefined,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen px-4 py-10 max-w-3xl mx-auto">
      {product.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={product.image}
          alt={product.title}
          className="w-full max-h-96 object-cover rounded-lg border mb-6"
        />
      )}

      <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
      <p className="text-2xl text-gray-700 mt-2">{product.price} تومان</p>

      {product.description && (
        <p className="text-gray-600 mt-4">{product.description}</p>
      )}

      <p className="text-sm mt-4">
        {product.stock > 0 ? (
          <span className="text-green-600">{product.stock} عدد موجود</span>
        ) : (
          <span className="text-red-600">ناموجود</span>
        )}
      </p>
    </main>
  );
}