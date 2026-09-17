import { productRepository } from "../repositories/product.repository";
import { CreateProductInput, UpdateProductInput } from "../schemas/product.schema";
import { JwtPayload } from "../utils/jwt";
import { CreateProductRepositoryInput } from "../types/product.types";

class AppError extends Error {
  constructor(public statusCode: number, public code: string, message: string) {
    super(message);
  }
}

async function getAllProducts() {
  return productRepository.findAll();
}

async function getProductById(id: string) {
  const product = await productRepository.findById(id);
  if (!product) {
    throw new AppError(404, "PRODUCT_NOT_FOUND", "Product not found");
  }
  return product;
}

async function createProduct(input: CreateProductInput, sellerId: string) {
  const existing = await productRepository.findBySlug(input.slug);
  if (existing) {
    throw new AppError(409, "SLUG_ALREADY_EXISTS", "A product with this slug already exists");
  }

  return productRepository.create({ ...input, sellerId });
}

async function updateProduct(id: string, input: UpdateProductInput, user: JwtPayload) {
  const product = await productRepository.findById(id);
  if (!product) {
    throw new AppError(404, "PRODUCT_NOT_FOUND", "Product not found");
  }

  // قانون مالکیت: Seller فقط محصول خودش را می‌تواند ویرایش کند؛ Admin استثناست
  if (user.role !== "ADMIN" && product.sellerId !== user.userId) {
    throw new AppError(403, "FORBIDDEN", "You can only edit your own products");
  }

  const updated = await productRepository.update(id, input);
  return updated!;
}

async function deleteProduct(id: string, user: JwtPayload) {
  const product = await productRepository.findById(id);
  if (!product) {
    throw new AppError(404, "PRODUCT_NOT_FOUND", "Product not found");
  }

  if (user.role !== "ADMIN" && product.sellerId !== user.userId) {
    throw new AppError(403, "FORBIDDEN", "You can only delete your own products");
  }

  await productRepository.remove(id);
}

export const productService = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

export { AppError };