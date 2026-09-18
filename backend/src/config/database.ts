import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // حداکثر تعداد اتصالات همزمان در Pool
  idleTimeoutMillis: 30000, // اتصال بیکار بعد از ۳۰ ثانیه بسته می‌شود
  connectionTimeoutMillis: 5000, // اگر ۵ ثانیه طول کشید تا اتصال جدید باز شود، خطا بده
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle PostgreSQL client", err);
});