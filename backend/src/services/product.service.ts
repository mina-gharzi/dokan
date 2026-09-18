import { productRepository } from "../repositories/product.repository";
import {
  CreateProductInput,
  UpdateProductInput,
} from "../schemas/product.schema";
import { JwtPayload } from "../utils/jwt";

class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

const VALID_SORTS = ["price_asc", "price_desc", "newest", "oldest"];

async function getAllProducts(rawFilters: {
  search?: string;
  categoryId?: string;
  sort?: string;
  page?: string;
  limit?: string;
}) {
  const page = Math.max(1, Number(rawFilters.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(rawFilters.limit) || 12));
  const sort = VALID_SORTS.includes(rawFilters.sort ?? "")
    ? (rawFilters.sort as any)
    : "newest";

  return productRepository.findAll({
    search: rawFilters.search,
    categoryId: rawFilters.categoryId,
    sort,
    page,
    limit,
  });
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
    throw new AppError(
      409,
      "SLUG_ALREADY_EXISTS",
      "A product with this slug already exists",
    );
  }

  return productRepository.create({ ...input, sellerId });
}

async function updateProduct(
  id: string,
  input: UpdateProductInput,
  user: JwtPayload,
) {
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
    throw new AppError(
      403,
      "FORBIDDEN",
      "You can only delete your own products",
    );
  }

  await productRepository.remove(id);
}

async function getProductBySlug(slug: string) {
  const product = await productRepository.findBySlug(slug);
  if (!product) {
    throw new AppError(404, "PRODUCT_NOT_FOUND", "Product not found");
  }
  return product;
}

export const productService = {
  getAllProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};

export { AppError };
