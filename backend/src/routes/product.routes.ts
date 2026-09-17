import { Router } from "express";
import { productController } from "../controllers/product.controller";
import { validate } from "../middleware/validate";
import { createProductSchema, updateProductSchema } from "../schemas/product.schema";

const router = Router();

router.get("/", productController.getAll);
router.get("/:id", productController.getOne);
router.post("/", validate(createProductSchema), productController.create);
router.patch("/:id", validate(updateProductSchema), productController.update);
router.delete("/:id", productController.remove);

export default router;