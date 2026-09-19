"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold text-gray-900">مشکلی پیش اومد</h1>
      <p className="text-gray-600 mt-2">{error.message || "یه خطای غیرمنتظره رخ داد."}</p>
      <button
        onClick={reset}
        className="mt-6 bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700"
      >
        تلاش دوباره
      </button>
    </main>
  );
}