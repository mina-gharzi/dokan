export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  // این فیلدها از JOIN با products می‌آیند — برای نمایش لازم‌اند
  productTitle: string;
  productSlug: string;
  productPrice: number;
  productImage: string | null;
  productStock: number;
}

export interface CartWithItems {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
}