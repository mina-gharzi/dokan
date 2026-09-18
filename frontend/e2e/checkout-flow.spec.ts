import { test, expect } from "@playwright/test";

test("Customer می‌تواند محصول را جستجو کند، به سبد اضافه کند، و Checkout بزند", async ({ page }) => {
  // فرض: یک کاربر Customer از قبل در دیتابیس Test موجود است
  await page.goto("/login");

  await page.getByLabel("Email").fill("customer@test.com");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Login" }).click();

  await page.waitForURL(/\/seller\/products\/new|\/products/);

  // برو به لیست محصولات
  await page.goto("/products");

  // اولین محصول را باز کن
  await page.locator("a[href^='/products/']").first().click();

  // Add to Cart
  await page.getByRole("button", { name: "Add to Cart" }).click();
  await expect(page.getByText("Added to cart!")).toBeVisible();

  // برو به سبد خرید
  await page.goto("/cart");
  await expect(page.getByText("Your Cart")).toBeVisible();

  // Checkout بزن
  await page.getByRole("button", { name: "Checkout" }).click();

  // باید به صفحه‌ی جزئیات سفارش منتقل شویم
  await page.waitForURL(/\/orders\//);
  await expect(page.getByText(/Order #/)).toBeVisible();
});

test("کاربر بدون Login نمی‌تواند به صفحه‌ی ساخت محصول Seller برسد", async ({ page }) => {
  await page.goto("/seller/products/new");
  await expect(page.getByText(/must be logged in/i)).toBeVisible();
});