import { getProducts } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters";
import { Pagination } from "@/components/Pagination";
import { EmptyState } from "@/components/EmptyState";

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;

  const result = await getProducts({
    search: params.search,
    category: params.category,
    sort: params.sort,
    page: params.page ? Number(params.page) : 1,
  });

  return (
    <main className="min-h-screen px-4 py-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">همه محصولات</h1>

      <ProductFilters />

      {result.data.length === 0 ? (
        <EmptyState
          title="محصولی پیدا نشد"
          description="جست‌وجو یا فیلترهاتو تغییر بده."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {result.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <Pagination
        currentPage={result.pagination.page}
        totalPages={result.pagination.totalPages}
      />
    </main>
  );
}