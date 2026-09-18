export default function ProductsLoading() {
  return (
    <main className="min-h-screen px-4 py-10 max-w-5xl mx-auto">
      <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="h-5 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </main>
  );
}