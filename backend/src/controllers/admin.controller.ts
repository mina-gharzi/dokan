import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { adminService } from "../services/admin.service";

function parsePagination(req: Request) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
  return { page, limit };
}

const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = parsePagination(req);
  const result = await adminService.listUsers(page, limit);
  res.status(200).json({ success: true, ...result });
});

const updateUserRole = asyncHandler(async (req: Request<{ userId: string }>, res: Response) => {
  const user = await adminService.changeUserRole(req.params.userId, req.body.role);
  res.status(200).json({ success: true, data: user });
});

const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = parsePagination(req);
  const result = await adminService.listOrders(page, limit);
  res.status(200).json({ success: true, ...result });
});

const updateOrderStatus = asyncHandler(async (req: Request<{ orderId: string }>, res: Response) => {
  const order = await adminService.changeOrderStatus(req.params.orderId, req.body.status);
  res.status(200).json({ success: true, data: order });
});

export const adminController = { getUsers, updateUserRole, getOrders, updateOrderStatus };