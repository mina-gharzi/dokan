import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { orderService } from "../services/order.service";

const checkout = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.checkout(req.user!.userId);
  res.status(201).json({ success: true, data: order });
});

const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await orderService.getMyOrders(req.user!.userId);
  res.status(200).json({ success: true, data: orders });
});

const getOne = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
  const order = await orderService.getOrderById(req.params.id, req.user!.userId, req.user!.role);
  res.status(200).json({ success: true, data: order });
});

export const orderController = { checkout, getMyOrders, getOne };