import Link from "next/link";
import { getProducts } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { EmptyState } from "@/components/EmptyState";

export default async function HomePage() {
  const result = await getProducts({ sort: "newest" });
  const featured = result.data.slice(0, 6);

  return (
    <main className="min-h-screen">
      <section className="max-w-5xl mx-auto px-4 pt-16 pb-12">
        <h1 className="text-4xl font-bold text-gray-900 max-w-xl">
          بازاری برای فروشنده‌های مستقل.
        </h1>
        <p className="text-lg text-gray-600 mt-4 max-w-md">
          دکان خریداران رو به فروشنده‌های مستقل توی یه فروشگاه واحد وصل می‌کنه —
          محصولات رو ببین، بخر، و سفارش‌هاتو در یک‌جا پیگیری کن.
        </p>

        <div className="flex items-center gap-4 mt-8">
          <Link
            href="/products"
            className="bg-blue-600 text-white rounded-md px-5 py-2.5 text-sm font-medium hover:bg-blue-700"
          >
            مشاهده محصولات
          </Link>
          <Link
            href="/seller/products/new"
            className="text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            ← فروشنده شو
          </Link>
        </div>

        <div className="flex gap-10 mt-12 pt-8 border-t">
          <div>
            <p className="text-2xl font-bold text-gray-900">{result.pagination.total}</p>
            <p className="text-sm text-gray-500 mt-1">محصول ثبت‌شده</p>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">جدیدترین محصولات</h2>
          <Link href="/products" className="text-sm text-blue-600 hover:underline">
            مشاهده همه
          </Link>
        </div>

        {featured.length === 0 ? (
          <EmptyState
            title="هنوز محصولی ثبت نشده"
            description="به‌محض این‌که فروشنده‌ها محصول اضافه کنن، اینجا نمایش داده می‌شه."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}