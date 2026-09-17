import { Product, CreateProductInput, UpdateProductInput } from "../types/product.types";

let products: Product[] = [
  { id: "1", title: "iPhone 15", slug: "iphone-15", price: 999, stock: 10 },
  { id: "2", title: "Wireless Headphones", slug: "wireless-headphones", price: 79, stock: 25 },
  { id: "3", title: "Gaming Keyboard", slug: "gaming-keyboard", price: 59, stock: 0 },
];

function findAll(): Product[] {
  return products;
}

function findById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

function findBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

function create(input: CreateProductInput): Product {
  const newProduct: Product = {
    id: String(products.length + 1),
    ...input,
  };
  products.push(newProduct);
  return newProduct;
}

function update(id: string, input: UpdateProductInput): Product | undefined {
  const product = findById(id);
  if (!product) return undefined;

  Object.assign(product, input);
  return product;
}

function remove(id: string): boolean {
  const exists = findById(id);
  if (!exists) return false;

  products = products.filter((p) => p.id !== id);
  return true;
}

export const productRepository = {
  findAll,
  findById,
  findBySlug,
  create,
  update,
  remove,
};