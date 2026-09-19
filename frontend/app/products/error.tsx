"use client";

export default function ProductsError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h2 className="text-xl font-semibold text-gray-900">بارگذاری محصولات با خطا مواجه شد</h2>
      <p className="text-gray-600 mt-2">{error.message}</p>
      <button
        onClick={reset}
        className="mt-4 bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700"
      >
        تلاش دوباره
      </button>
    </main>
  );
}