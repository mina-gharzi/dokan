import { Request, Response } from "express";
import { orderService } from "../services/order.service";
import { AppError } from "../services/product.service";

async function checkout(req: Request, res: Response) {
  try {
    const order = await orderService.checkout(req.user!.userId);
    res.status(201).json({ success: true, data: order });
  } catch (err) {
    handleError(err, res);
  }
}

async function getMyOrders(req: Request, res: Response) {
  try {
    const orders = await orderService.getMyOrders(req.user!.userId);
    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    handleError(err, res);
  }
}

async function getOne(req: Request<{ id: string }>, res: Response) {
  try {
    const order = await orderService.getOrderById(req.params.id, req.user!.userId, req.user!.role);
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

export const orderController = { checkout, getMyOrders, getOne };