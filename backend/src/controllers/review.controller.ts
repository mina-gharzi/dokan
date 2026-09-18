import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { reviewService } from "../services/review.service";

const getForProduct = asyncHandler(async (req: Request<{ productId: string }>, res: Response) => {
  const data = await reviewService.getProductReviews(req.params.productId);
  res.status(200).json({ success: true, data });
});

const create = asyncHandler(async (req: Request<{ productId: string }>, res: Response) => {
  const review = await reviewService.createReview(req.params.productId, req.user!.userId, req.body);
  res.status(201).json({ success: true, data: review });
});

export const reviewController = { getForProduct, create };