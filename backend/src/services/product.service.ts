import { productRepository } from "../repositories/product.repository";
import { CreateProductInput, UpdateProductInput } from "../types/product.types";

class AppError extends Error {
  constructor(public statusCode: number, public code: string, message: string) {
    super(message);
  }
}

function getAllProducts() {
  return productRepository.findAll();
}

function getProductById(id: string) {
  const product = productRepository.findById(id);
  if (!product) {
    throw new AppError(404, "PRODUCT_NOT_FOUND", "Product not found");
  }
  return product;
}

function createProduct(input: CreateProductInput) {
  const existing = productRepository.findBySlug(input.slug);
  if (existing) {
    throw new AppError(409, "SLUG_ALREADY_EXISTS", "A product with this slug already exists");
  }
  return productRepository.create(input);
}

function updateProduct(id: string, input: UpdateProductInput) {
  const updated = productRepository.update(id, input);
  if (!updated) {
    throw new AppError(404, "PRODUCT_NOT_FOUND", "Product not found");
  }
  return updated;
}

function deleteProduct(id: string) {
  const deleted = productRepository.remove(id);
  if (!deleted) {
    throw new AppError(404, "PRODUCT_NOT_FOUND", "Product not found");
  }
}

export const productService = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

export { AppError };