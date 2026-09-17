import { Router } from "express";
import { orderController } from "../controllers/order.controller";
import { authenticate } from "../middleware/authenticate";

const router = Router();

router.use(authenticate);

router.post("/checkout", orderController.checkout);
router.get("/", orderController.getMyOrders);
router.get("/:id", orderController.getOne);

export default router;