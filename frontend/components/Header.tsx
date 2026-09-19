"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <header className="border-b bg-white">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-gray-900">
          دکان
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/products" className="text-sm text-gray-700 hover:text-blue-600">
            محصولات
          </Link>
          <Link href="/cart" className="text-sm text-gray-700 hover:text-blue-600">
            سبد خرید
          </Link>

          {!isLoading && user && (
            <Link href="/orders" className="text-sm text-gray-700 hover:text-blue-600">
              سفارش‌های من
            </Link>
          )}

          {!isLoading && user && (user.role === "SELLER" || user.role === "ADMIN") && (
            <Link href="/seller/products/new" className="text-sm text-gray-700 hover:text-blue-600">
              فروش
            </Link>
          )}

          {!isLoading && user && user.role === "ADMIN" && (
            <Link href="/admin/users" className="text-sm text-gray-700 hover:text-blue-600">
              مدیریت
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {isLoading ? null : user ? (
            <>
              <span className="text-sm text-gray-500 hidden sm:inline">{user.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-700 border rounded-md px-3 py-1.5 hover:bg-gray-50"
              >
                خروج
              </button>
            </>
          ) : (
            <>
              <Link
                href="/register"
                className="text-sm text-gray-700 hover:text-blue-600 hidden sm:inline"
              >
                ثبت‌نام
              </Link>
              <Link
                href="/login"
                className="text-sm bg-blue-600 text-white rounded-md px-3 py-1.5 hover:bg-blue-700"
              >
                ورود
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}