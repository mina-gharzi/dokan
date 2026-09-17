import { Request, Response } from "express";
import { authService, AppError } from "../services/auth.service";

async function register(req: Request, res: Response) {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    handleError(err, res);
  }
}

async function login(req: Request, res: Response) {
  try {
    const result = await authService.login(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    handleError(err, res);
  }
}

function me(req: Request, res: Response) {
  res.status(200).json({ success: true, data: { userId: req.user!.userId, role: req.user!.role } });
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

export const authController = { register, login, me };