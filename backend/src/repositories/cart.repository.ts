import { pool } from "../config/database";
import { CartItem } from "../types/cart.types";

async function findCartIdByUserId(userId: string): Promise<string | undefined> {
  const result = await pool.query("SELECT id FROM carts WHERE user_id = $1", [userId]);
  return result.rows[0]?.id;
}

async function createCartForUser(userId: string): Promise<string> {
  const result = await pool.query(
    "INSERT INTO carts (user_id) VALUES ($1) RETURNING id",
    [userId]
  );
  return result.rows[0].id;
}

async function getOrCreateCartId(userId: string): Promise<string> {
  const existing = await findCartIdByUserId(userId);
  if (existing) return existing;
  return createCartForUser(userId);
}

function mapRowToCartItem(row: any): CartItem {
  return {
    id: row.id,
    cartId: row.cart_id,
    productId: row.product_id,
    quantity: row.quantity,
    productTitle: row.title,
    productSlug: row.slug,
    productPrice: Number(row.price),
    productImage: row.image,
    productStock: row.stock,
  };
}

async function findItemsByCartId(cartId: string): Promise<CartItem[]> {
  const result = await pool.query(
    `SELECT ci.id, ci.cart_id, ci.product_id, ci.quantity,
            p.title, p.slug, p.price, p.image, p.stock
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     WHERE ci.cart_id = $1
     ORDER BY ci.id`,
    [cartId]
  );
  return result.rows.map(mapRowToCartItem);
}

async function findItem(cartId: string, productId: string) {
  const result = await pool.query(
    "SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2",
    [cartId, productId]
  );
  return result.rows[0];
}

async function addItem(cartId: string, productId: string, quantity: number): Promise<void> {
  const existing = await findItem(cartId, productId);

  if (existing) {
    await pool.query(
      "UPDATE cart_items SET quantity = quantity + $1 WHERE id = $2",
      [quantity, existing.id]
    );
  } else {
    await pool.query(
      "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3)",
      [cartId, productId, quantity]
    );
  }
}

async function updateItemQuantity(cartId: string, productId: string, quantity: number): Promise<boolean> {
  const result = await pool.query(
    "UPDATE cart_items SET quantity = $1 WHERE cart_id = $2 AND product_id = $3",
    [quantity, cartId, productId]
  );
  return (result.rowCount ?? 0) > 0;
}

async function removeItem(cartId: string, productId: string): Promise<boolean> {
  const result = await pool.query(
    "DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2",
    [cartId, productId]
  );
  return (result.rowCount ?? 0) > 0;
}

export const cartRepository = {
  getOrCreateCartId,
  findItemsByCartId,
  findItem,
  addItem,
  updateItemQuantity,
  removeItem,
};