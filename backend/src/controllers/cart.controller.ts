import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { cartService } from "../services/cart.service";

const getCart = asyncHandler(async (req: Request, res: Response) => {
  const cart = await cartService.getCart(req.user!.userId);
  res.status(200).json({ success: true, data: cart });
});

const addItem = asyncHandler(async (req: Request, res: Response) => {
  const { productId, quantity } = req.body;
  const cart = await cartService.addToCart(req.user!.userId, productId, quantity);
  res.status(200).json({ success: true, data: cart });
});

const updateItem = asyncHandler(async (req: Request<{ productId: string }>, res: Response) => {
  const { quantity } = req.body;
  const cart = await cartService.updateCartItem(req.user!.userId, req.params.productId, quantity);
  res.status(200).json({ success: true, data: cart });
});

const removeItem = asyncHandler(async (req: Request<{ productId: string }>, res: Response) => {
  const cart = await cartService.removeFromCart(req.user!.userId, req.params.productId);
  res.status(200).json({ success: true, data: cart });
});

export const cartController = { getCart, addItem, updateItem, removeItem };