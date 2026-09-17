import { pool } from "../config/database";
import { Product, CreateProductInput, UpdateProductInput } from "../types/product.types";

// نگاشت یک Row خام از دیتابیس (snake_case) به شیء Product (camelCase)
function mapRowToProduct(row: any): Product {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    price: Number(row.price),
    stock: row.stock,
    image: row.image,
    categoryId: row.category_id,
    sellerId: row.seller_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function findAll(): Promise<Product[]> {
  const result = await pool.query("SELECT * FROM products ORDER BY created_at DESC");
  return result.rows.map(mapRowToProduct);
}

async function findById(id: string): Promise<Product | undefined> {
  const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
  return result.rows[0] ? mapRowToProduct(result.rows[0]) : undefined;
}

async function findBySlug(slug: string): Promise<Product | undefined> {
  const result = await pool.query("SELECT * FROM products WHERE slug = $1", [slug]);
  return result.rows[0] ? mapRowToProduct(result.rows[0]) : undefined;
}

async function create(input: CreateProductInput): Promise<Product> {
  const result = await pool.query(
    `INSERT INTO products (title, slug, description, price, stock, image, category_id, seller_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      input.title,
      input.slug,
      input.description ?? null,
      input.price,
      input.stock,
      input.image ?? null,
      input.categoryId,
      input.sellerId,
    ]
  );
  return mapRowToProduct(result.rows[0]);
}

async function update(id: string, input: UpdateProductInput): Promise<Product | undefined> {
  const existing = await findById(id);
  if (!existing) return undefined;

  const result = await pool.query(
    `UPDATE products
     SET title = $1, slug = $2, description = $3, price = $4, stock = $5, image = $6, category_id = $7, updated_at = now()
     WHERE id = $8
     RETURNING *`,
    [
      input.title ?? existing.title,
      input.slug ?? existing.slug,
      input.description ?? existing.description,
      input.price ?? existing.price,
      input.stock ?? existing.stock,
      input.image ?? existing.image,
      input.categoryId ?? existing.categoryId,
      id,
    ]
  );
  return mapRowToProduct(result.rows[0]);
}

async function remove(id: string): Promise<boolean> {
  const result = await pool.query("DELETE FROM products WHERE id = $1", [id]);
  return (result.rowCount ?? 0) > 0;
}

export const productRepository = {
  findAll,
  findById,
  findBySlug,
  create,
  update,
  remove,
};