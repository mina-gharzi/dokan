import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app";
import { testPool, cleanDatabase, closeTestDb } from "../setup/testDb";

describe("Product API", () => {
  let sellerToken: string;
  let categoryId: string;

  beforeAll(async () => {
    await cleanDatabase();

    // یک Seller واقعی بساز و Login کن تا Token بگیریم
    await request(app).post("/api/auth/register").send({
      name: "Test Seller",
      email: "seller@test.com",
      password: "password123",
    });

    // نقشش را دستی به SELLER تغییر بده (چون Register همیشه CUSTOMER می‌سازد)
    await testPool.query("UPDATE users SET role = 'SELLER' WHERE email = $1", ["seller@test.com"]);

    const loginRes = await request(app).post("/api/auth/login").send({
      email: "seller@test.com",
      password: "password123",
    });
    sellerToken = loginRes.body.data.token;

    const catResult = await testPool.query(
      "INSERT INTO categories (name) VALUES ($1) RETURNING id",
      ["Electronics"]
    );
    categoryId = catResult.rows[0].id;
  });

  afterAll(async () => {
    await closeTestDb();
  });

  it("GET /api/products بدون هیچ Auth کار می‌کند و آرایه برمی‌گرداند", async () => {
    const res = await request(app).get("/api/products");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("POST /api/products بدون Token رد می‌شود", async () => {
    const res = await request(app).post("/api/products").send({
      title: "Test Product",
      slug: "test-product",
      price: 100,
      stock: 10,
      categoryId,
    });

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });

  it("POST /api/products با Token Seller موفق می‌شود", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${sellerToken}`)
      .send({
        title: "Gaming Mouse",
        slug: "gaming-mouse-test",
        price: 49.99,
        stock: 20,
        categoryId,
      });

    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe("Gaming Mouse");
    expect(res.body.data.sellerId).toBeDefined();
  });

  it("POST /api/products با price منفی رد می‌شود (Validation)", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${sellerToken}`)
      .send({
        title: "Invalid Product",
        slug: "invalid-product",
        price: -10,
        stock: 5,
        categoryId,
      });

    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });
});