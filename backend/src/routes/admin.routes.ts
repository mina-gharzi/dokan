import { Router } from "express";
import { adminController } from "../controllers/admin.controller";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";

const router = Router();

// همه‌ی Route های Admin، همیشه هر دو لایه را دارند
router.use(authenticate, authorize("ADMIN"));

router.get("/users", adminController.getUsers);
router.patch("/users/:userId/role", adminController.updateUserRole);

router.get("/orders", adminController.getOrders);
router.patch("/orders/:orderId/status", adminController.updateOrderStatus);

export default router;