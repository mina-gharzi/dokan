import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(422).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid input data",
          details: result.error.flatten().fieldErrors,
        },
      });
    }

    req.body = result.data; // داده‌ی تمیز و Type-safe جایگزین body خام می‌شود
    next();
  };
}