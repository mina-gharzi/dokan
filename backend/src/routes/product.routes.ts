import { Router } from "express";
import { productController } from "../controllers/product.controller";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { createProductSchema, updateProductSchema } from "../schemas/product.schema";

const router = Router();

// عمومی — نیازی به Login ندارد
router.get("/", productController.getAll);
router.get("/:id", productController.getOne);

// فقط SELLER یا ADMIN می‌توانند محصول بسازند
router.post(
  "/",
  authenticate,
  authorize("SELLER", "ADMIN"),
  validate(createProductSchema),
  productController.create
);

// فقط SELLER (مالک) یا ADMIN می‌توانند ویرایش کنند — بررسی مالکیت داخل Service است
router.patch(
  "/:id",
  authenticate,
  authorize("SELLER", "ADMIN"),
  validate(updateProductSchema),
  productController.update
);

// فقط SELLER (مالک) یا ADMIN می‌توانند حذف کنند
router.delete(
  "/:id",
  authenticate,
  authorize("SELLER", "ADMIN"),
  productController.remove
);

export default router;