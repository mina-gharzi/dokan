import { Router } from "express";
import { cartController } from "../controllers/cart.controller";
import { authenticate } from "../middleware/authenticate";
import { validate } from "../middleware/validate";
import { addToCartSchema, updateCartItemSchema } from "../schemas/cart.schema";

const router = Router();

// همه‌ی Route های Cart نیاز به Login دارند — چون Cart همیشه شخصی است
router.use(authenticate);

router.get("/", cartController.getCart);
router.post("/items", validate(addToCartSchema), cartController.addItem);
router.patch("/items/:productId", validate(updateCartItemSchema), cartController.updateItem);
router.delete("/items/:productId", cartController.removeItem);

export default router;