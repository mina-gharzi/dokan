import { Request, Response } from "express";
import { adminService } from "../services/admin.service";
import { AppError } from "../services/product.service";

function parsePagination(req: Request) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
  return { page, limit };
}

async function getUsers(req: Request, res: Response) {
  try {
    const { page, limit } = parsePagination(req);
    const result = await adminService.listUsers(page, limit);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    handleError(err, res);
  }
}

async function updateUserRole(req: Request<{ userId: string }>, res: Response) {
  try {
    const user = await adminService.changeUserRole(req.params.userId, req.body.role);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    handleError(err, res);
  }
}

async function getOrders(req: Request, res: Response) {
  try {
    const { page, limit } = parsePagination(req);
    const result = await adminService.listOrders(page, limit);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    handleError(err, res);
  }
}

async function updateOrderStatus(req: Request<{ orderId: string }>, res: Response) {
  try {
    const order = await adminService.changeOrderStatus(req.params.orderId, req.body.status);
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    handleError(err, res);
  }
}

function handleError(err: unknown, res: Response) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: { code: err.code, message: err.message },
    });
  }
  console.error(err);
  res.status(500).json({
    success: false,
    error: { code: "INTERNAL_ERROR", message: "Something went wrong" },
  });
}

export const adminController = { getUsers, updateUserRole, getOrders, updateOrderStatus };