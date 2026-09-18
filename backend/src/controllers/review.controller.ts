import { Request, Response } from "express";
import { reviewService } from "../services/review.service";
import { AppError } from "../services/product.service";

async function getForProduct(req: Request<{ productId: string }>, res: Response) {
  try {
    const data = await reviewService.getProductReviews(req.params.productId);
    res.status(200).json({ success: true, data });
  } catch (err) {
    handleError(err, res);
  }
}

async function create(req: Request<{ productId: string }>, res: Response) {
  try {
    const review = await reviewService.createReview(req.params.productId, req.user!.userId, req.body);
    res.status(201).json({ success: true, data: review });
  } catch (err) {
    handleError(err, res);
  }
}

function handleError(err: unknown, res: Response) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: { code: err.code, message: err.message },
    });
  }
  console.error(err);
  res.status(500).json({
    success: false,
    error: { code: "INTERNAL_ERROR", message: "Something went wrong" },
  });
}

export const reviewController = { getForProduct, create };