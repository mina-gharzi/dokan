import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold text-gray-900">۴۰۴</h1>
      <p className="text-gray-600 mt-2">صفحه‌ای که دنبالشی وجود نداره.</p>
      <Link href="/" className="mt-6 text-blue-600 hover:underline">
        برگشت به خانه
      </Link>
    </main>
  );
}