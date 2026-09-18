import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold text-gray-900">404</h1>
      <p className="text-gray-600 mt-2">The page you're looking for doesn't exist.</p>
      <Link href="/" className="mt-6 text-blue-600 hover:underline">
        Go back home
      </Link>
    </main>
  );
}