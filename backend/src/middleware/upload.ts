import multer from "multer";
import { Request } from "express";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function fileFilter(req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(new Error("Only JPEG, PNG, and WebP images are allowed"));
  }
  cb(null, true);
}

// memoryStorage: فایل روی دیسک سرور ذخیره نمی‌شه، فقط توی حافظه به‌صورت Buffer
// نگه‌داشته می‌شه تا مستقیم به Cloudinary استریم بشه — چون دیسک سرورهای رایگان
// (Render, Railway free tier) ephemeral هست و با هر ریستارت پاک می‌شه
export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});