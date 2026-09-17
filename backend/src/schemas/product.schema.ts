import { z } from "zod";

export const createProductSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug must be lowercase, using only letters, numbers, and hyphens"),
  description: z.string().optional(),
  price: z.number().positive("Price must be a positive number"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  image: z.string().url("Image must be a valid URL").optional(),
  categoryId: z.string().uuid("categoryId must be a valid UUID"),
  sellerId: z.string().uuid("sellerId must be a valid UUID"),
});

export const updateProductSchema = createProductSchema
  .omit({ sellerId: true })
  .partial();

// این تایپ‌ها را مستقیم از Schema استخراج می‌کنیم — دیگر لازم نیست دستی در types/product.types.ts بازنویسی‌شان کنیم
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;