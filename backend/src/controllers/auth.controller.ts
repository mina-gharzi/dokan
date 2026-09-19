import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { authService } from "../services/auth.service";

const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // ۷ روز — باید با JWT_EXPIRES_IN هماهنگ بماند

function setAuthCookie(res: Response, token: string) {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("token", token, {
    httpOnly: true, // جاوااسکریپت فرانت اصلاً نمی‌تواند این کوکی را بخواند (محافظت در برابر XSS)
    secure: isProd, // در production فقط روی HTTPS فرستاده می‌شود
    // در dev فرانت و بک‌اند هر دو روی localhost‌اند (Same-Site) → lax کافی است.
    // در production معمولاً روی دو دامنه‌ی متفاوت دیپلوی می‌شوند (مثلاً vercel.app و render.com)
    // که یعنی Cross-Site هستند؛ برای این حالت کوکی باید sameSite: "none" باشد وگرنه اصلاً فرستاده نمی‌شود.
    sameSite: isProd ? "none" : "lax",
    maxAge: COOKIE_MAX_AGE_MS,
    path: "/",
  });
}

const register = asyncHandler(async (req: Request, res: Response) => {
  const { user, token } = await authService.register(req.body);
  setAuthCookie(res, token);
  res.status(201).json({ success: true, data: { user } });
});

const login = asyncHandler(async (req: Request, res: Response) => {
  const { user, token } = await authService.login(req.body);
  setAuthCookie(res, token);
  res.status(200).json({ success: true, data: { user } });
});

const logout = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie("token", { path: "/" });
  res.status(200).json({ success: true, data: { message: "Logged out" } });
});

const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.getCurrentUser(req.user!.userId);
  res.status(200).json({ success: true, data: { user } });
});

export const authController = { register, login, logout, me };