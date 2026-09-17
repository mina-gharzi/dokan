import express, { Request, Response } from "express";
import authRoutes from "./routes/auth.routes";

const app = express();

// Middleware: بدنه‌ی JSON را می‌خواند و در req.body قابل دسترس می‌کند
app.use(express.json());

app.use("/api/auth", authRoutes);

// یک Route ساده برای تست سلامت سرور
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ success: true, data: { status: "ok" } });
});

export default app;