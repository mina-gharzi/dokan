import dotenv from "dotenv";
dotenv.config();

import argon2 from "argon2";
import { pool } from "../config/database";

const DEMO_SELLER_EMAIL = "seller@dokan.dev";
const DEMO_SELLER_PASSWORD = "password123"; // فقط برای دمو — توی production هیچ‌وقت پسورد پیش‌فرض نذار

const DEMO_CATEGORIES = ["الکترونیک", "خانه و آشپزخانه", "پوشاک"];

const DEMO_PRODUCTS = [
  {
    title: "هدفون بی‌سیم مشکی",
    slug: "wireless-headphones-black",
    description: "هدفون بی‌سیم با کیفیت صدای بالا و باتری ۳۰ ساعته.",
    price: 1250000,
    stock: 14,
    image: "https://picsum.photos/seed/dokan-headphones/600/600",
    categoryIndex: 0,
  },
  {
    title: "ساعت هوشمند",
    slug: "smart-watch",
    description: "ساعت هوشمند با نمایشگر AMOLED و ردیابی سلامت.",
    price: 2100000,
    stock: 8,
    image: "https://picsum.photos/seed/dokan-smartwatch/600/600",
    categoryIndex: 0,
  },
  {
    title: "کتری برقی استیل",
    slug: "steel-electric-kettle",
    description: "کتری برقی ۱.۷ لیتری با بدنه استیل ضدزنگ.",
    price: 780000,
    stock: 20,
    image: "https://picsum.photos/seed/dokan-kettle/600/600",
    categoryIndex: 1,
  },
  {
    title: "سرویس ۶ پارچه ظروف پخت",
    slug: "cookware-set-6pc",
    description: "سرویس ۶ پارچه قابلمه و ماهیتابه با روکش نچسب.",
    price: 3400000,
    stock: 5,
    image: "https://picsum.photos/seed/dokan-cookware/600/600",
    categoryIndex: 1,
  },
  {
    title: "کاپشن زمستانی مردانه",
    slug: "mens-winter-jacket",
    description: "کاپشن ضدآب و گرم، مناسب هوای سرد.",
    price: 1650000,
    stock: 12,
    image: "https://picsum.photos/seed/dokan-jacket/600/600",
    categoryIndex: 2,
  },
  {
    title: "کفش ورزشی سفید",
    slug: "white-sneakers",
    description: "کفش ورزشی سبک و راحت برای استفاده روزمره.",
    price: 980000,
    stock: 0, // عمداً ناموجود گذاشتیم تا حالت "ناموجود" رو هم توی UI ببینی
    image: "https://picsum.photos/seed/dokan-sneakers/600/600",
    categoryIndex: 2,
  },
];

async function seed() {
  console.log("🌱 شروع Seed...");

  // ۱. جدول دسته‌بندی رو اگه نبود می‌سازه (idempotent)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(100) NOT NULL UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  // ۲. دسته‌بندی‌های دمو (اگه از قبل هست، رد می‌شه)
  const categoryIds: string[] = [];
  for (const name of DEMO_CATEGORIES) {
    const existing = await pool.query("SELECT id FROM categories WHERE name = $1", [name]);
    if (existing.rows[0]) {
      categoryIds.push(existing.rows[0].id);
      continue;
    }
    const result = await pool.query("INSERT INTO categories (name) VALUES ($1) RETURNING id", [name]);
    categoryIds.push(result.rows[0].id);
  }
  console.log(`✅ ${categoryIds.length} دسته‌بندی آماده شد`);

  // ۳. کاربر فروشنده‌ی دمو (اگه از قبل هست، پسوردش رو دست نمی‌زنیم)
  const existingSeller = await pool.query("SELECT id FROM users WHERE email = $1", [
    DEMO_SELLER_EMAIL,
  ]);

  let sellerId: string;
  if (existingSeller.rows[0]) {
    sellerId = existingSeller.rows[0].id;
    console.log("ℹ️  فروشنده‌ی دمو از قبل وجود داره");
  } else {
    const hashedPassword = await argon2.hash(DEMO_SELLER_PASSWORD);
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'SELLER')
       RETURNING id`,
      ["فروشگاه دمو", DEMO_SELLER_EMAIL, hashedPassword]
    );
    sellerId = result.rows[0].id;
    console.log(`✅ کاربر فروشنده‌ی دمو ساخته شد (${DEMO_SELLER_EMAIL} / ${DEMO_SELLER_PASSWORD})`);
  }

  // ۴. محصولات دمو (فقط اگه از قبل با همین slug نبودن)
  let insertedCount = 0;
  for (const product of DEMO_PRODUCTS) {
    const existing = await pool.query("SELECT id FROM products WHERE slug = $1", [product.slug]);
    if (existing.rows[0]) continue;

    await pool.query(
      `INSERT INTO products (title, slug, description, price, stock, image, category_id, seller_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        product.title,
        product.slug,
        product.description,
        product.price,
        product.stock,
        product.image,
        categoryIds[product.categoryIndex],
        sellerId,
      ]
    );
    insertedCount++;
  }
  console.log(`✅ ${insertedCount} محصول جدید اضافه شد (بقیه از قبل موجود بودن)`);

  console.log("🎉 Seed تموم شد.");
  await pool.end();
}

seed().catch((err) => {
  console.error("❌ Seed با خطا مواجه شد:", err);
  process.exit(1);
});