import { Address } from './user';

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface PaymentInfo {
  method: string;
  status: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  transactionId?: string;
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: Address;
  payment: PaymentInfo;
  orderStatus: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderCreateRequest {
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: Address;
  paymentMethod: string;
}

export interface OrderStatusUpdate {
  orderId: string;
  status: Order['orderStatus'];
  trackingNumber?: string;
}