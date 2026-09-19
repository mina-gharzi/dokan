import { reviewRepository } from "../repositories/review.repository";
import { productRepository } from "../repositories/product.repository";
import { AppError } from "../utils/AppError";
import { CreateReviewInput } from "../schemas/review.schema";

async function getProductReviews(productId: string) {
  const reviews = await reviewRepository.findByProductId(productId);
  const { average, count } = await reviewRepository.getAverageRating(productId);
  return { reviews, averageRating: average, reviewCount: count };
}

async function createReview(productId: string, customerId: string, input: CreateReviewInput) {
  const product = await productRepository.findById(productId);
  if (!product) {
    throw new AppError(404, "PRODUCT_NOT_FOUND", "Product not found");
  }

  // قانون ۱: فقط خریداران واقعی
  const hasPurchased = await reviewRepository.hasPurchasedProduct(customerId, productId);
  if (!hasPurchased) {
    throw new AppError(
      403,
      "PURCHASE_REQUIRED",
      "You can only review products you have purchased"
    );
  }

  // قانون ۲: هر کاربر فقط یک Review برای هر محصول (دیتابیس هم با UNIQUE این را تضمین می‌کند، ولی پیام واضح‌تر اینجا بهتر است)
  const existing = await reviewRepository.findByCustomerAndProduct(customerId, productId);
  if (existing) {
    throw new AppError(409, "REVIEW_ALREADY_EXISTS", "You have already reviewed this product");
  }

  return reviewRepository.create(productId, customerId, input.rating, input.comment);
}

export const reviewService = {
  getProductReviews,
  createReview,
};