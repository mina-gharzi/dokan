import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { cloudinary } from "../config/cloudinary";
import { AppError } from "../utils/AppError";

const upload = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError(400, "NO_FILE", "No image file was uploaded");
  }

  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    // شکست واضح به‌جای خطای گنگ اگه ادمین پروژه هنوز کلیدهای Cloudinary رو ست نکرده
    throw new AppError(
      500,
      "UPLOAD_NOT_CONFIGURED",
      "Image upload is not configured on the server (missing Cloudinary credentials)"
    );
  }

  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "dokan/products" },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result);
      }
    );
    stream.end(req.file!.buffer);
  });

  res.status(201).json({ success: true, data: { url: result.secure_url } });
});

export const uploadController = { upload };