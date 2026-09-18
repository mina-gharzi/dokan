import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import productRoutes from "./routes/product.routes";
import authRoutes from "./routes/auth.routes";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";
import adminRoutes from "./routes/admin.routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { generalLimiter, authLimiter } from "./middleware/rateLimiter";

const app = express();

// امنیت: Security Headers — باید نزدیک به بالاترین لایه باشد
app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// امنیت: محدود کردن حجم Body — جلوگیری از حملات حجیم
app.use(express.json({ limit: "10kb" }));

// امنیت: Rate Limiting عمومی روی کل API
app.use("/api", generalLimiter);

app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ success: true, data: { status: "ok" } });
});

// Rate Limiting سخت‌گیرانه‌تر فقط روی مسیرهای حساس Auth
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;