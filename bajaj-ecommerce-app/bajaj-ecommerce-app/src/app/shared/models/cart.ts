export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItemWithProduct extends CartItem {
  product: {
    name: string;
    images: string[];
    brand: string;
    stock: number;
  };
}

export interface CartSummary {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
}