import rateLimit from "express-rate-limit";

// محدودیت عمومی برای کل API — نسبتاً سخاوتمندانه
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // ۱۵ دقیقه
  max: 300, // حداکثر ۳۰۰ درخواست در این بازه، برای هر IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: "TOO_MANY_REQUESTS", message: "Too many requests, please try again later" },
  },
});

// محدودیت سخت‌گیرانه‌تر مخصوص Login/Register — جلوگیری از Brute-force
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // فقط ۱۰ تلاش در ۱۵ دقیقه
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // فقط تلاش‌های ناموفق (پسورد غلط) را می‌شمارد
  message: {
    success: false,
    error: { code: "TOO_MANY_ATTEMPTS", message: "Too many login attempts, please try again later" },
  },
});