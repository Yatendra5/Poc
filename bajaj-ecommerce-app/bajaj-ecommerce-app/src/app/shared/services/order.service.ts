import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Order, OrderCreateRequest, OrderItem } from '../models/order';
import { AuthService } from '../../features/auth/services/auth.service';
import { CartItemWithProduct } from '../models/cart';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly API_URL = 'http://localhost:9090/api/orders';
  private readonly ORDER_STORAGE_KEY = 'user_orders';
  
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  public orders$ = this.ordersSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.loadOrders();
  }

  // Create a new order
  createOrder(orderData: OrderCreateRequest): Observable<Order> {
    if (this.authService.isAuthenticated()) {
      return this.createUserOrder(orderData);
    } else {
      return throwError(() => new Error('User must be logged in to place an order'));
    }
  }

  // Get user's orders
  getUserOrders(): Observable<Order[]> {
    if (this.authService.isAuthenticated()) {
      return this.loadUserOrders();
    } else {
      return of([]);
    }
  }

  // Get order by ID
  getOrderById(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.API_URL}/${orderId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Private methods for API calls
  private createUserOrder(orderData: OrderCreateRequest): Observable<Order> {
    return this.http.post<Order>(`${this.API_URL}`, orderData)
      .pipe(
        tap(order => {
          // Add the new order to local orders list
          const currentOrders = this.ordersSubject.value;
          this.ordersSubject.next([order, ...currentOrders]);
          
          // Also save to localStorage as backup
          this.saveOrdersToLocalStorage([order, ...currentOrders]);
        }),
        catchError(error => {
          console.error('API call failed, creating order locally:', error);
          // Fallback: create order locally if API fails
          return this.createOrderLocally(orderData);
        })
      );
  }

  private loadUserOrders(): Observable<Order[]> {
    return this.http.get<{ orders: Order[] }>(`${this.API_URL}`)
      .pipe(
        map(response => response.orders),
        tap(orders => {
          this.ordersSubject.next(orders);
          this.saveOrdersToLocalStorage(orders);
        }),
        catchError(error => {
          console.error('API call failed, loading orders from localStorage:', error);
          // Fallback: load from localStorage if API fails
          return this.loadOrdersFromLocalStorage();
        })
      );
  }

  // Fallback methods for local storage
  private createOrderLocally(orderData: OrderCreateRequest): Observable<Order> {
    return new Observable<Order>(observer => {
      try {
        const currentUser = this.authService.getCurrentUser();
        if (!currentUser) {
          throw new Error('No user logged in');
        }

        const newOrder: Order = {
          _id: this.generateOrderId(),
          userId: currentUser._id,
          items: orderData.items.map(item => ({
            productId: item.productId,
            name: `Product ${item.productId}`, // This should be populated with actual product name
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity
          })),
          shippingAddress: orderData.shippingAddress,
          payment: {
            method: orderData.paymentMethod,
            status: 'Pending'
          },
          orderStatus: 'Pending',
          totalAmount: orderData.items.reduce((total, item) => total + (item.price * item.quantity), 0),
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const currentOrders = this.ordersSubject.value;
        const updatedOrders = [newOrder, ...currentOrders];
        
        this.ordersSubject.next(updatedOrders);
        this.saveOrdersToLocalStorage(updatedOrders);

        observer.next(newOrder);
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    });
  }

  private loadOrdersFromLocalStorage(): Observable<Order[]> {
    return new Observable<Order[]>(observer => {
      try {
        const ordersData = localStorage.getItem(this.ORDER_STORAGE_KEY);
        if (ordersData) {
          const orders: Order[] = JSON.parse(ordersData);
          this.ordersSubject.next(orders);
          observer.next(orders);
        } else {
          this.ordersSubject.next([]);
          observer.next([]);
        }
        observer.complete();
      } catch (error) {
        console.error('Error loading orders from localStorage:', error);
        this.ordersSubject.next([]);
        observer.next([]);
        observer.complete();
      }
    });
  }

  private saveOrdersToLocalStorage(orders: Order[]): void {
    try {
      localStorage.setItem(this.ORDER_STORAGE_KEY, JSON.stringify(orders));
    } catch (error) {
      console.error('Error saving orders to localStorage:', error);
    }
  }

  private loadOrders(): void {
    if (this.authService.isAuthenticated()) {
      this.loadUserOrders().subscribe();
    } else {
      this.loadOrdersFromLocalStorage().subscribe();
    }
  }

  private generateOrderId(): string {
    return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
  }

  // Helper method to convert cart items to order items
  convertCartItemsToOrderItems(cartItems: CartItemWithProduct[]): Array<{productId: string, quantity: number, price: number}> {
    return cartItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price
    }));
  }

  // Enhanced method to create order with proper product names
  createOrderWithProductNames(cartItems: CartItemWithProduct[], orderData: OrderCreateRequest): Observable<Order> {
    return new Observable<Order>(observer => {
      try {
        const currentUser = this.authService.getCurrentUser();
        if (!currentUser) {
          throw new Error('No user logged in');
        }

        const newOrder: Order = {
          _id: this.generateOrderId(),
          userId: currentUser._id,
          items: cartItems.map(cartItem => ({
            productId: cartItem.productId,
            name: cartItem.product.name,
            quantity: cartItem.quantity,
            price: cartItem.price,
            total: cartItem.price * cartItem.quantity
          })),
          shippingAddress: orderData.shippingAddress,
          payment: {
            method: orderData.paymentMethod,
            status: 'Pending'
          },
          orderStatus: 'Pending',
          totalAmount: cartItems.reduce((total, item) => total + (item.price * item.quantity), 0),
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const currentOrders = this.ordersSubject.value;
        const updatedOrders = [newOrder, ...currentOrders];
        
        this.ordersSubject.next(updatedOrders);
        this.saveOrdersToLocalStorage(updatedOrders);

        observer.next(newOrder);
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    });
  }

  private handleError(error: any): Observable<never> {
    console.error('Order Service Error:', error);
    return throwError(() => new Error(
      error.error?.message || 'An error occurred with order operation'
    ));
  }
}