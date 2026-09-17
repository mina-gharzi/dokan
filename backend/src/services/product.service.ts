import { productRepository } from "../repositories/product.repository";
import { CreateProductInput, UpdateProductInput } from "../schemas/product.schema";

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

async function createProduct(input: CreateProductInput) {
  const existing = await productRepository.findBySlug(input.slug);
  if (existing) {
    throw new AppError(409, "SLUG_ALREADY_EXISTS", "A product with this slug already exists");
  }
  return productRepository.create(input);
}

async function updateProduct(id: string, input: UpdateProductInput) {
  const updated = await productRepository.update(id, input);
  if (!updated) {
    throw new AppError(404, "PRODUCT_NOT_FOUND", "Product not found");
  }
  return updated;
}

async function deleteProduct(id: string) {
  const deleted = await productRepository.remove(id);
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