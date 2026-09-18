import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock کردن کل ماژول Repository — به‌جای رفتن واقعی به دیتابیس
vi.mock("../../src/repositories/product.repository", () => ({
  productRepository: {
    findById: vi.fn(),
    findBySlug: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

import { productRepository } from "../../src/repositories/product.repository";
import { productService, AppError } from "../../src/services/product.service";

describe("productService.getProductById", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // هر تست را مستقل نگه می‌دارد (Test Isolation)
  });

  it("محصول را برمی‌گرداند اگر پیدا شود", async () => {
    // Arrange
    const fakeProduct = { id: "1", title: "iPhone 15", slug: "iphone-15", price: 999 };
    vi.mocked(productRepository.findById).mockResolvedValue(fakeProduct as any);

    // Act
    const result = await productService.getProductById("1");

    // Assert
    expect(result).toEqual(fakeProduct);
    expect(productRepository.findById).toHaveBeenCalledWith("1");
  });

  it("اگر محصول پیدا نشد، AppError با کد 404 پرتاب می‌کند", async () => {
    vi.mocked(productRepository.findById).mockResolvedValue(undefined);

    await expect(productService.getProductById("999")).rejects.toThrow(AppError);

    try {
      await productService.getProductById("999");
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
      expect((err as AppError).statusCode).toBe(404);
      expect((err as AppError).code).toBe("PRODUCT_NOT_FOUND");
    }
  });
});

describe("productService.createProduct", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("اگر slug تکراری باشد، خطای 409 می‌دهد", async () => {
    vi.mocked(productRepository.findBySlug).mockResolvedValue({ id: "1" } as any);

    const input = { title: "Test", slug: "iphone-15", price: 100, stock: 5, categoryId: "cat-1" };

    await expect(productService.createProduct(input, "seller-1")).rejects.toMatchObject({
      statusCode: 409,
      code: "SLUG_ALREADY_EXISTS",
    });
  });

  it("اگر slug تکراری نباشد، محصول را با sellerId صحیح می‌سازد", async () => {
    vi.mocked(productRepository.findBySlug).mockResolvedValue(undefined);
    vi.mocked(productRepository.create).mockResolvedValue({ id: "new-1" } as any);

    const input = { title: "Test", slug: "new-product", price: 100, stock: 5, categoryId: "cat-1" };
    await productService.createProduct(input, "seller-1");

    expect(productRepository.create).toHaveBeenCalledWith({
      ...input,
      sellerId: "seller-1",
    });
  });
});