"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getMyOrders, Order } from "@/lib/api";
import { EmptyState } from "@/components/EmptyState";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "در انتظار",
  CONFIRMED: "تأییدشده",
  PROCESSING: "در حال آماده‌سازی",
  SHIPPED: "ارسال‌شده",
  DELIVERED: "تحویل‌شده",
  CANCELLED: "لغوشده",
};

export default function MyOrdersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    getMyOrders()
      .then(setOrders)
      .finally(() => setIsLoading(false));
  }, [user]);

  if (authLoading || isLoading) {
    return <p className="text-center py-10">در حال بارگذاری...</p>;
  }

  if (!user) {
    return <p className="text-center py-10">برای مشاهده سفارش‌هات وارد شو.</p>;
  }

  return (
    <main className="min-h-screen px-4 py-10 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">سفارش‌های من</h1>

      {orders.length === 0 ? (
        <EmptyState
          title="هنوز سفارشی ثبت نکردی"
          description="بعد از خرید، سفارش‌هات اینجا نمایش داده می‌شن."
        />
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="flex items-center justify-between border rounded-md p-4 hover:shadow-sm transition-shadow"
            >
              <div>
                <p className="font-medium text-gray-900">سفارش #{order.id.slice(0, 8)}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {STATUS_LABELS[order.status] ?? order.status}
                </p>
              </div>
              <p className="font-bold text-gray-900">{order.total} تومان</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}