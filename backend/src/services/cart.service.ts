import { cartRepository } from "../repositories/cart.repository";
import { productRepository } from "../repositories/product.repository";
import { CartWithItems } from "../types/cart.types";

class AppError extends Error {
  constructor(public statusCode: number, public code: string, message: string) {
    super(message);
  }
}

function calculateTotal(items: { productPrice: number; quantity: number }[]): number {
  return items.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);
}

async function getCart(userId: string): Promise<CartWithItems> {
  const cartId = await cartRepository.getOrCreateCartId(userId);
  const items = await cartRepository.findItemsByCartId(cartId);

  return {
    id: cartId,
    userId,
    items,
    total: calculateTotal(items),
  };
}

async function addToCart(userId: string, productId: string, quantity: number): Promise<CartWithItems> {
  const product = await productRepository.findById(productId);
  if (!product) {
    throw new AppError(404, "PRODUCT_NOT_FOUND", "Product not found");
  }

  if (product.stock < quantity) {
    throw new AppError(422, "INSUFFICIENT_STOCK", "Not enough stock for this product");
  }

  const cartId = await cartRepository.getOrCreateCartId(userId);
  await cartRepository.addItem(cartId, productId, quantity);

  return getCart(userId);
}

async function updateCartItem(userId: string, productId: string, quantity: number): Promise<CartWithItems> {
  const product = await productRepository.findById(productId);
  if (!product) {
    throw new AppError(404, "PRODUCT_NOT_FOUND", "Product not found");
  }

  if (product.stock < quantity) {
    throw new AppError(422, "INSUFFICIENT_STOCK", "Not enough stock for this product");
  }

  const cartId = await cartRepository.getOrCreateCartId(userId);
  const updated = await cartRepository.updateItemQuantity(cartId, productId, quantity);

  if (!updated) {
    throw new AppError(404, "CART_ITEM_NOT_FOUND", "This product is not in your cart");
  }

  return getCart(userId);
}

async function removeFromCart(userId: string, productId: string): Promise<CartWithItems> {
  const cartId = await cartRepository.getOrCreateCartId(userId);
  const removed = await cartRepository.removeItem(cartId, productId);

  if (!removed) {
    throw new AppError(404, "CART_ITEM_NOT_FOUND", "This product is not in your cart");
  }

  return getCart(userId);
}

export const cartService = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
};

export { AppError };