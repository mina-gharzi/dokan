import { pool } from "../config/database";
import { Review } from "../types/review.types";

// قلب قانون Business: آیا این کاربر واقعاً این محصول را خریده و سفارشش معتبر است؟
async function hasPurchasedProduct(customerId: string, productId: string): Promise<boolean> {
  const result = await pool.query(
    `SELECT 1
     FROM orders o
     JOIN order_items oi ON oi.order_id = o.id
     WHERE o.customer_id = $1
       AND oi.product_id = $2
       AND o.status IN ('CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED')
     LIMIT 1`,
    [customerId, productId]
  );
  return (result.rowCount ?? 0) > 0;
}

async function findByCustomerAndProduct(customerId: string, productId: string) {
  const result = await pool.query(
    "SELECT * FROM reviews WHERE customer_id = $1 AND product_id = $2",
    [customerId, productId]
  );
  return result.rows[0];
}

function mapRowToReview(row: any): Review {
  return {
    id: row.id,
    productId: row.product_id,
    customerId: row.customer_id,
    customerName: row.name,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.created_at,
  };
}

async function findByProductId(productId: string): Promise<Review[]> {
  const result = await pool.query(
    `SELECT r.id, r.product_id, r.customer_id, r.rating, r.comment, r.created_at, u.name
     FROM reviews r
     JOIN users u ON u.id = r.customer_id
     WHERE r.product_id = $1
     ORDER BY r.created_at DESC`,
    [productId]
  );
  return result.rows.map(mapRowToReview);
}

async function getAverageRating(productId: string): Promise<{ average: number; count: number }> {
  const result = await pool.query(
    `SELECT AVG(rating)::numeric(10,2) as average, COUNT(*) as count
     FROM reviews
     WHERE product_id = $1`,
    [productId]
  );
  return {
    average: Number(result.rows[0].average) || 0,
    count: Number(result.rows[0].count),
  };
}

async function create(
  productId: string,
  customerId: string,
  rating: number,
  comment: string | undefined
): Promise<Review> {
  // نیاز داریم Order ای که این خرید را ثابت می‌کند پیدا کنیم تا order_id را هم ذخیره کنیم (طبق طراحی Phase 7)
  const orderResult = await pool.query(
    `SELECT o.id
     FROM orders o
     JOIN order_items oi ON oi.order_id = o.id
     WHERE o.customer_id = $1 AND oi.product_id = $2
     ORDER BY o.created_at DESC
     LIMIT 1`,
    [customerId, productId]
  );
  const orderId = orderResult.rows[0].id;

  const result = await pool.query(
    `INSERT INTO reviews (product_id, customer_id, order_id, rating, comment)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [productId, customerId, orderId, rating, comment ?? null]
  );

  const userResult = await pool.query("SELECT name FROM users WHERE id = $1", [customerId]);

  return mapRowToReview({ ...result.rows[0], name: userResult.rows[0].name });
}

export const reviewRepository = {
  hasPurchasedProduct,
  findByCustomerAndProduct,
  findByProductId,
  getAverageRating,
  create,
};