"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getCart, updateCartItem, removeFromCart, Cart } from "@/lib/api";

export default function CartPage() {
  const { token, isLoading: authLoading } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    getCart(token)
      .then(setCart)
      .finally(() => setIsLoading(false));
  }, [token]);

  async function handleQuantityChange(productId: string, quantity: number) {
    if (!token) return;
    const updated = await updateCartItem(productId, quantity, token);
    setCart(updated);
  }

  async function handleRemove(productId: string) {
    if (!token) return;
    const updated = await removeFromCart(productId, token);
    setCart(updated);
  }

  if (authLoading || isLoading) {
    return <p className="text-center py-10">Loading...</p>;
  }

  if (!token) {
    return <p className="text-center py-10">Please log in to view your cart.</p>;
  }

  if (!cart || cart.items.length === 0) {
    return <p className="text-center py-10">Your cart is empty.</p>;
  }

  return (
    <main className="min-h-screen px-4 py-10 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Cart</h1>

      <div className="space-y-4">
        {cart.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between border rounded-md p-4">
            <div>
              <p className="font-medium text-gray-900">{item.productTitle}</p>
              <p className="text-sm text-gray-500">${item.productPrice} each</p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={item.productStock}
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.productId, Number(e.target.value))}
                className="w-16 border rounded-md px-2 py-1"
              />
              <button
                onClick={() => handleRemove(item.productId)}
                className="text-red-600 text-sm hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-right text-xl font-bold text-gray-900">
        Total: ${cart.total.toFixed(2)}
      </div>
    </main>
  );
}