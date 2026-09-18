import { Request, Response, NextFunction } from "express";
import { AppError } from "../services/product.service";

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: { code: err.code, message: err.message },
    });
  }

  // خطای غیرمنتظره — لاگش می‌کنیم ولی جزئیات داخلی را به کاربر نشان نمی‌دهیم
  console.error(err);
  res.status(500).json({
    success: false,
    error: { code: "INTERNAL_ERROR", message: "Something went wrong" },
  });
}

// برای مسیرهایی که اصلاً پیدا نشدند (404 عمومی)
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    error: { code: "ROUTE_NOT_FOUND", message: `Cannot ${req.method} ${req.path}` },
  });
}