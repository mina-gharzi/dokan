import { getProducts } from "@/lib/api";

export default async function HomePage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen px-4 py-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dokan Products</h1>

      {products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 shadow-sm">
              <h2 className="font-semibold text-lg text-gray-900">{product.title}</h2>
              <p className="text-gray-500 text-sm mt-1">${product.price}</p>
              <p className="text-gray-400 text-xs mt-1">Stock: {product.stock}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}