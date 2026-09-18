import express, { Request, Response } from "express";
import cors from "cors";
import productRoutes from "./routes/product.routes";
import authRoutes from "./routes/auth.routes";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";
import adminRoutes from "./routes/admin.routes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // فقط Frontend خودمان اجازه دارد
  })
);

app.use(express.json());

app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ success: true, data: { status: "ok" } });
});

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

export default app;