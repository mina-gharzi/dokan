"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getAdminOrders, updateOrderStatus, AdminOrder } from "@/lib/api";

const STATUS_OPTIONS = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function AdminOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    getAdminOrders().then((res) => {
      setOrders(res.data);
      setIsLoading(false);
    });
  }, [user]);

  async function handleStatusChange(orderId: string, newStatus: string) {
    setError(null);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    }
  }

  if (isLoading) return <p className="text-center py-10">Loading orders...</p>;

  return (
    <main className="px-4 py-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Customer</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b">
              <td className="py-2">{o.customer_name}</td>
              <td>${o.total}</td>
              <td>
                <select
                  value={o.status}
                  onChange={(e) => handleStatusChange(o.id, e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}