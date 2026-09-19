import { Router, Request, Response, NextFunction } from "express";
import { upload } from "../middleware/upload";
import { uploadController } from "../controllers/upload.controller";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { AppError } from "../utils/AppError";

const router = Router();

// multer خودش خطاهای فایل (حجم زیاد، فرمت غلط) رو مستقیم به next(err) پاس می‌ده که
// اگر دست‌نخورده بمونه، errorHandler چون AppError نیست بهش ۵۰۰ عمومی می‌ده — این
// wrapper اون‌ها رو به یه AppError با پیام واضح (۴۰۰) تبدیل می‌کنه
function handleUpload(req: Request, res: Response, next: NextFunction) {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return next(new AppError(400, "UPLOAD_ERROR", err.message));
    }
    next();
  });
}

// فقط SELLER/ADMIN می‌تونن عکس آپلود کنن (چون فقط برای اضافه‌کردن محصول استفاده می‌شه)
router.post("/", authenticate, authorize("SELLER", "ADMIN"), handleUpload, uploadController.upload);

export default router;