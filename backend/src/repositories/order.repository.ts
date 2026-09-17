import { PoolClient } from "pg";
import { pool } from "../config/database";
import { Order, OrderItem } from "../types/order.types";

// قفل کردن ردیف Product برای جلوگیری از Race Condition — باید داخل یک Transaction صدا زده شود
async function lockProductForUpdate(client: PoolClient, productId: string) {
  const result = await client.query(
    "SELECT id, price, stock FROM products WHERE id = $1 FOR UPDATE",
    [productId]
  );
  return result.rows[0]; // undefined اگر پیدا نشد
}

async function decrementStock(client: PoolClient, productId: string, quantity: number) {
  await client.query(
    "UPDATE products SET stock = stock - $1 WHERE id = $2",
    [quantity, productId]
  );
}

async function createOrder(
  client: PoolClient,
  customerId: string,
  total: number
): Promise<string> {
  const result = await client.query(
    `INSERT INTO orders (customer_id, total, status) VALUES ($1, $2, 'PENDING') RETURNING id`,
    [customerId, total]
  );
  return result.rows[0].id;
}

async function createOrderItem(
  client: PoolClient,
  orderId: string,
  productId: string,
  quantity: number,
  priceAtPurchase: number
) {
  await client.query(
    `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
     VALUES ($1, $2, $3, $4)`,
    [orderId, productId, quantity, priceAtPurchase]
  );
}

async function clearCartItems(client: PoolClient, cartId: string) {
  await client.query("DELETE FROM cart_items WHERE cart_id = $1", [cartId]);
}

function mapRowToOrder(row: any): Omit<Order, "items"> {
  return {
    id: row.id,
    customerId: row.customer_id,
    status: row.status,
    total: Number(row.total),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapRowToOrderItem(row: any): OrderItem {
  return {
    id: row.id,
    productId: row.product_id,
    productTitle: row.title,
    quantity: row.quantity,
    priceAtPurchase: Number(row.price_at_purchase),
  };
}

async function findOrderById(orderId: string): Promise<Order | undefined> {
  const orderResult = await pool.query("SELECT * FROM orders WHERE id = $1", [orderId]);
  if (!orderResult.rows[0]) return undefined;

  const itemsResult = await pool.query(
    `SELECT oi.id, oi.product_id, oi.quantity, oi.price_at_purchase, p.title
     FROM order_items oi
     JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = $1`,
    [orderId]
  );

  return {
    ...mapRowToOrder(orderResult.rows[0]),
    items: itemsResult.rows.map(mapRowToOrderItem),
  };
}

async function findOrdersByCustomerId(customerId: string): Promise<Order[]> {
  const ordersResult = await pool.query(
    "SELECT * FROM orders WHERE customer_id = $1 ORDER BY created_at DESC",
    [customerId]
  );

  const orders: Order[] = [];
  for (const row of ordersResult.rows) {
    const itemsResult = await pool.query(
      `SELECT oi.id, oi.product_id, oi.quantity, oi.price_at_purchase, p.title
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = $1`,
      [row.id]
    );
    orders.push({
      ...mapRowToOrder(row),
      items: itemsResult.rows.map(mapRowToOrderItem),
    });
  }

  return orders;
}

export const orderRepository = {
  lockProductForUpdate,
  decrementStock,
  createOrder,
  createOrderItem,
  clearCartItems,
  findOrderById,
  findOrdersByCustomerId,
};