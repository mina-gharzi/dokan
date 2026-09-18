import { Router } from "express";
import { reviewController } from "../controllers/review.controller";
import { authenticate } from "../middleware/authenticate";
import { validate } from "../middleware/validate";
import { createReviewSchema } from "../schemas/review.schema";

const router = Router({ mergeParams: true }); // برای دسترسی به productId از Route والد

router.get("/", reviewController.getForProduct);
router.post("/", authenticate, validate(createReviewSchema), reviewController.create);

export default router;