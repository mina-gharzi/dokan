"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <p className="text-center py-10">در حال بارگذاری...</p>;
  }

  if (!user || user.role !== "ADMIN") {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <p className="text-gray-600">برای دسترسی به این صفحه باید ادمین باشی.</p>
      </main>
    );
  }

  return (
    <div>
      <nav className="border-b px-4 py-3 flex gap-4">
        <Link href="/admin/users" className="text-sm font-medium text-gray-700 hover:text-blue-600">
          کاربران
        </Link>
        <Link href="/admin/orders" className="text-sm font-medium text-gray-700 hover:text-blue-600">
          سفارش‌ها
        </Link>
      </nav>
      {children}
    </div>
  );
}