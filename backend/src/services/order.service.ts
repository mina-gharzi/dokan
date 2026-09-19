import { pool } from "../config/database";
import { orderRepository } from "../repositories/order.repository";
import { cartRepository } from "../repositories/cart.repository";
import { AppError } from "../utils/AppError";

async function checkout(userId: string) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const cartId = await cartRepository.getOrCreateCartId(userId);
    const cartItems = await cartRepository.findItemsByCartId(cartId);

    if (cartItems.length === 0) {
      throw new AppError(422, "CART_EMPTY", "Your cart is empty");
    }

    let total = 0;
    const validatedItems: { productId: string; quantity: number; price: number }[] = [];

    // قدم مهم: برای هر آیتم، محصول را قفل کن و Stock واقعی (نه Cache شده) را چک کن
    for (const item of cartItems) {
      const product = await orderRepository.lockProductForUpdate(client, item.productId);

      if (!product) {
        throw new AppError(404, "PRODUCT_NOT_FOUND", `Product ${item.productTitle} no longer exists`);
      }

      if (product.stock < item.quantity) {
        throw new AppError(
          422,
          "INSUFFICIENT_STOCK",
          `Not enough stock for ${item.productTitle}. Available: ${product.stock}`
        );
      }

      const price = Number(product.price);
      total += price * item.quantity;
      validatedItems.push({ productId: item.productId, quantity: item.quantity, price });
    }

    const orderId = await orderRepository.createOrder(client, userId, total);

    for (const item of validatedItems) {
      await orderRepository.createOrderItem(client, orderId, item.productId, item.quantity, item.price);
      await orderRepository.decrementStock(client, item.productId, item.quantity);
    }

    await orderRepository.clearCartItems(client, cartId);

    await client.query("COMMIT");

    return orderRepository.findOrderById(orderId);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

async function getOrderById(orderId: string, userId: string, userRole: string) {
  const order = await orderRepository.findOrderById(orderId);

  if (!order) {
    throw new AppError(404, "ORDER_NOT_FOUND", "Order not found");
  }

  if (userRole !== "ADMIN" && order.customerId !== userId) {
    throw new AppError(403, "FORBIDDEN", "You can only view your own orders");
  }

  return order;
}

async function getMyOrders(userId: string) {
  return orderRepository.findOrdersByCustomerId(userId);
}

export const orderService = {
  checkout,
  getOrderById,
  getMyOrders,
};