const REQUIRED_ENV_VARS = ["JWT_SECRET", "DATABASE_URL"] as const;
const OPTIONAL_ENV_VARS = ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"] as const;

export function validateEnv(): void {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(
      `❌ Missing required environment variable(s): ${missing.join(", ")}\n` +
        `   Check your .env file — the server cannot start without these.`
    );
    process.exit(1);
  }

  // این‌ها server رو متوقف نمی‌کنن، چون فقط فیچر آپلود عکس بهشون نیاز داره —
  // فقط یه هشدار واضح می‌دیم که اون فیچر کار نمی‌کنه تا وقتی ست بشن
  const missingOptional = OPTIONAL_ENV_VARS.filter((key) => !process.env[key]);
  if (missingOptional.length > 0) {
    console.warn(
      `⚠️  Missing optional environment variable(s): ${missingOptional.join(", ")}\n` +
        `   Image upload will not work until these are set.`
    );
  }
}