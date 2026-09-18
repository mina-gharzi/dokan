import { pool } from "../config/database";
import { Product, CreateProductRepositoryInput } from "../types/product.types";
import { UpdateProductInput } from "../schemas/product.schema";
import { ProductFilters, PaginatedProducts } from "../types/product.types";

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

const SORT_MAP: Record<string, string> = {
  price_asc: "price ASC",
  price_desc: "price DESC",
  newest: "created_at DESC",
  oldest: "created_at ASC",
};

async function findAll(filters: ProductFilters): Promise<PaginatedProducts> {
  const conditions: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  if (filters.search) {
    conditions.push(`title ILIKE $${paramIndex}`);
    values.push(`%${filters.search}%`);
    paramIndex++;
  }

  if (filters.categoryId) {
    conditions.push(`category_id = $${paramIndex}`);
    values.push(filters.categoryId);
    paramIndex++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const orderClause = `ORDER BY ${SORT_MAP[filters.sort ?? "newest"]}`;

  const offset = (filters.page - 1) * filters.limit;

  // Query اصلی: داده‌ی همین صفحه
  const dataQuery = `
    SELECT * FROM products
    ${whereClause}
    ${orderClause}
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;
  const dataValues = [...values, filters.limit, offset];

  // Query دوم: تعداد کل رکوردهای منطبق (بدون LIMIT/OFFSET) — برای محاسبه‌ی totalPages
  const countQuery = `SELECT COUNT(*) FROM products ${whereClause}`;

  const [dataResult, countResult] = await Promise.all([
    pool.query(dataQuery, dataValues),
    pool.query(countQuery, values),
  ]);

  const total = Number(countResult.rows[0].count);

  return {
    data: dataResult.rows.map(mapRowToProduct),
    pagination: {
      page: filters.page,
      limit: filters.limit,
      total,
      totalPages: Math.ceil(total / filters.limit),
    },
  };
}

async function findById(id: string): Promise<Product | undefined> {
  const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
  return result.rows[0] ? mapRowToProduct(result.rows[0]) : undefined;
}

async function findBySlug(slug: string): Promise<Product | undefined> {
  const result = await pool.query("SELECT * FROM products WHERE slug = $1", [slug]);
  return result.rows[0] ? mapRowToProduct(result.rows[0]) : undefined;
}

async function create(input: CreateProductRepositoryInput): Promise<Product> {
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