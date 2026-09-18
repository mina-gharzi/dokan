import { Pool } from "pg";

// یک دیتابیس کاملاً جدا برای تست — نباید هرگز با دیتابیس Development قاطی شود
export const testPool = new Pool({
  connectionString: process.env.TEST_DATABASE_URL,
});

export async function cleanDatabase() {
  // ترتیب مهم است: اول جدول‌های وابسته، بعد جدول‌های اصلی
  await testPool.query("TRUNCATE TABLE reviews, order_items, orders, cart_items, carts, products, categories, users CASCADE");
}

export async function closeTestDb() {
  await testPool.end();
}