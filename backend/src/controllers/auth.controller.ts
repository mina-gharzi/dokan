import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { authService } from "../services/auth.service";

const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  res.status(201).json({ success: true, data: result });
});

const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  res.status(200).json({ success: true, data: result });
});

const me = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ success: true, data: { userId: req.user!.userId, role: req.user!.role } });
});

export const authController = { register, login, me };