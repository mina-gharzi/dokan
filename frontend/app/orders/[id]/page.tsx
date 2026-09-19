"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getOrderById, Order } from "@/lib/api";

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

  if (authLoading || isLoading) return <p className="text-center py-10">Loading...</p>;
  if (!order) return <p className="text-center py-10">Order not found.</p>;

  return (
    <main className="min-h-screen px-4 py-10 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Order #{order.id.slice(0, 8)}</h1>
      <p className="text-sm text-gray-500 mt-1">Status: {order.status}</p>

      <div className="mt-6 space-y-3">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between border-b pb-2">
            <span>{item.productTitle} × {item.quantity}</span>
            <span>${(item.priceAtPurchase * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 text-right text-xl font-bold">
        Total: ${order.total.toFixed(2)}
      </div>
    </main>
  );
}