"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getOrderById, Order } from "@/lib/api";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "در انتظار",
  CONFIRMED: "تأییدشده",
  PROCESSING: "در حال آماده‌سازی",
  SHIPPED: "ارسال‌شده",
  DELIVERED: "تحویل‌شده",
  CANCELLED: "لغوشده",
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, isLoading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    getOrderById(id)
      .then(setOrder)
      .finally(() => setIsLoading(false));
  }, [id, user]);

  if (authLoading || isLoading) {
    return <p className="text-center py-10">در حال بارگذاری...</p>;
  }

  if (!user) {
    return <p className="text-center py-10">برای مشاهده سفارش وارد شو.</p>;
  }

  if (!order) {
    return <p className="text-center py-10">سفارش پیدا نشد.</p>;
  }

  return (
    <main className="min-h-screen px-4 py-10 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">سفارش #{order.id.slice(0, 8)}</h1>
      <p className="text-sm text-gray-500 mt-1">
        وضعیت: {STATUS_LABELS[order.status] ?? order.status}
      </p>

      <div className="mt-6 space-y-3">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between border rounded-md p-4">
            <p className="text-gray-900">{item.productTitle}</p>
            <p className="text-gray-500 text-sm">
              {item.quantity} × {item.priceAtPurchase} تومان
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 text-end text-xl font-bold">
        جمع کل: {order.total} تومان
      </div>
    </main>
  );
}