import { Request, Response } from "express";
import { cartService, AppError } from "../services/cart.service";

async function getCart(req: Request, res: Response) {
  try {
    const cart = await cartService.getCart(req.user!.userId);
    res.status(200).json({ success: true, data: cart });
  } catch (err) {
    handleError(err, res);
  }
}

async function addItem(req: Request, res: Response) {
  try {
    const { productId, quantity } = req.body;
    const cart = await cartService.addToCart(req.user!.userId, productId, quantity);
    res.status(200).json({ success: true, data: cart });
  } catch (err) {
    handleError(err, res);
  }
}

async function updateItem(req: Request<{ productId: string }>, res: Response) {
  try {
    const { quantity } = req.body;
    const cart = await cartService.updateCartItem(req.user!.userId, req.params.productId, quantity);
    res.status(200).json({ success: true, data: cart });
  } catch (err) {
    handleError(err, res);
  }
}

async function removeItem(req: Request<{ productId: string }>, res: Response) {
  try {
    const cart = await cartService.removeFromCart(req.user!.userId, req.params.productId);
    res.status(200).json({ success: true, data: cart });
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

export const cartController = { getCart, addItem, updateItem, removeItem };