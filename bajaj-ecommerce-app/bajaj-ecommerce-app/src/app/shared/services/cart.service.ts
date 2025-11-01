import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Cart, CartItem, CartItemWithProduct, CartSummary } from '../../shared/models/cart';
import { ProductData } from '../../features/products/models/product-data';
import { AuthService } from '../../features/auth/services/auth.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly API_URL = 'http://localhost:9090/api/cart';
  private readonly CART_STORAGE_KEY = 'guest_cart';
  
  private cartSubject = new BehaviorSubject<CartItemWithProduct[]>([]);
  public cart$ = this.cartSubject.asObservable();
  
  private cartSummarySubject = new BehaviorSubject<CartSummary>({
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0,
    itemCount: 0
  });
  public cartSummary$ = this.cartSummarySubject.asObservable();

  private readonly TAX_RATE = 0.1; // 10% tax
  private readonly SHIPPING_RATE = 50; // Flat shipping rate
  private readonly FREE_SHIPPING_THRESHOLD = 1000; // Free shipping above this amount

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.initializeCart();
  }

  // Initialize cart based on authentication status
  private initializeCart(): void {
    if (this.authService.isAuthenticated()) {
      this.loadUserCart().subscribe();
    } else {
      this.loadGuestCart();
    }

    // Subscribe to auth changes
    this.authService.currentUser$.subscribe((user: User | null) => {
      if (user) {
        this.syncGuestCartToUser();
      } else {
        this.clearCart();
      }
    });
  }

  // Add item to cart
  addToCart(product: ProductData, quantity: number = 1): Observable<void> {
    console.log('CartService: Adding to cart', { product: product.name, quantity, authenticated: this.authService.isAuthenticated() });
    
    if (this.authService.isAuthenticated()) {
      return this.addToUserCart(product._id, quantity);
    } else {
      return this.addToGuestCart(product, quantity);
    }
  }

  // Remove item from cart
  removeFromCart(productId: string): Observable<void> {
    if (this.authService.isAuthenticated()) {
      return this.removeFromUserCart(productId);
    } else {
      return this.removeFromGuestCart(productId);
    }
  }

  // Update item quantity
  updateQuantity(productId: string, quantity: number): Observable<void> {
    if (quantity <= 0) {
      return this.removeFromCart(productId);
    }

    if (this.authService.isAuthenticated()) {
      return this.updateUserCartQuantity(productId, quantity);
    } else {
      return this.updateGuestCartQuantity(productId, quantity);
    }
  }

  // Clear entire cart
  clearCart(): void {
    if (this.authService.isAuthenticated()) {
      this.clearUserCart().subscribe();
    } else {
      this.clearGuestCart();
    }
  }

  // Get cart count
  getCartCount(): Observable<number> {
    return this.cart$.pipe(
      map(items => items.reduce((total, item) => total + item.quantity, 0))
    );
  }

  // User cart operations (API calls)
  private loadUserCart(): Observable<CartItemWithProduct[]> {
    return this.http.get<{ items: CartItemWithProduct[] }>(`${this.API_URL}`)
      .pipe(
        map(response => response.items),
        tap(items => {
          this.cartSubject.next(items);
          this.updateCartSummary(items);
        }),
        catchError(error => {
          console.error('Error loading user cart:', error);
          return throwError(() => error);
        })
      );
  }

  private addToUserCart(productId: string, quantity: number): Observable<void> {
    return this.http.post<{ items: CartItemWithProduct[] }>(`${this.API_URL}/add`, {
      productId,
      quantity
    }).pipe(
      tap(response => {
        this.cartSubject.next(response.items);
        this.updateCartSummary(response.items);
      }),
      map(() => void 0),
      catchError(this.handleError)
    );
  }

  private removeFromUserCart(productId: string): Observable<void> {
    return this.http.delete<{ items: CartItemWithProduct[] }>(`${this.API_URL}/remove/${productId}`)
      .pipe(
        tap(response => {
          this.cartSubject.next(response.items);
          this.updateCartSummary(response.items);
        }),
        map(() => void 0),
        catchError(this.handleError)
      );
  }

  private updateUserCartQuantity(productId: string, quantity: number): Observable<void> {
    return this.http.put<{ items: CartItemWithProduct[] }>(`${this.API_URL}/update`, {
      productId,
      quantity
    }).pipe(
      tap(response => {
        this.cartSubject.next(response.items);
        this.updateCartSummary(response.items);
      }),
      map(() => void 0),
      catchError(this.handleError)
    );
  }

  private clearUserCart(): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/clear`)
      .pipe(
        tap(() => {
          this.cartSubject.next([]);
          this.updateCartSummary([]);
        }),
        catchError(this.handleError)
      );
  }

  // Guest cart operations (localStorage)
  private loadGuestCart(): void {
    const cartData = localStorage.getItem(this.CART_STORAGE_KEY);
    if (cartData) {
      try {
        const items: CartItemWithProduct[] = JSON.parse(cartData);
        this.cartSubject.next(items);
        this.updateCartSummary(items);
      } catch (error) {
        console.error('Error parsing guest cart data:', error);
        this.clearGuestCart();
      }
    }
  }

  private addToGuestCart(product: ProductData, quantity: number): Observable<void> {
    return new Observable<void>(observer => {
      try {
        console.log('CartService: Adding to guest cart', { productId: product._id, productName: product.name });
        
        const currentItems = this.cartSubject.value;
        const existingItemIndex = currentItems.findIndex(item => item.productId === product._id);

        let updatedItems: CartItemWithProduct[];
        if (existingItemIndex >= 0) {
          console.log('CartService: Updating existing item quantity');
          updatedItems = [...currentItems];
          updatedItems[existingItemIndex].quantity += quantity;
        } else {
          console.log('CartService: Adding new item to cart');
          const newItem: CartItemWithProduct = {
            productId: product._id,
            quantity,
            price: product.price,
            product: {
              name: product.name,
              images: product.images,
              brand: product.brand,
              stock: product.stock
            }
          };
          updatedItems = [...currentItems, newItem];
        }

        this.saveGuestCart(updatedItems);
        console.log('CartService: Guest cart updated successfully', { itemCount: updatedItems.length });
        observer.next();
        observer.complete();
      } catch (error) {
        console.error('CartService: Error adding to guest cart', error);
        observer.error(error);
      }
    });
  }

  private removeFromGuestCart(productId: string): Observable<void> {
    return new Observable<void>(observer => {
      try {
        const currentItems = this.cartSubject.value;
        const updatedItems = currentItems.filter(item => item.productId !== productId);
        this.saveGuestCart(updatedItems);
        observer.next();
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    });
  }

  private updateGuestCartQuantity(productId: string, quantity: number): Observable<void> {
    return new Observable<void>(observer => {
      try {
        const currentItems = this.cartSubject.value;
        const updatedItems = currentItems.map(item =>
          item.productId === productId ? { ...item, quantity } : item
        );
        this.saveGuestCart(updatedItems);
        observer.next();
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    });
  }

  private clearGuestCart(): void {
    localStorage.removeItem(this.CART_STORAGE_KEY);
    this.cartSubject.next([]);
    this.updateCartSummary([]);
  }

  private saveGuestCart(items: CartItemWithProduct[]): void {
    try {
      localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(items));
      this.cartSubject.next(items);
      this.updateCartSummary(items);
    } catch (error) {
      console.error('Error saving guest cart to localStorage:', error);
      // Still update the cart subject even if localStorage fails
      this.cartSubject.next(items);
      this.updateCartSummary(items);
    }
  }

  // Sync guest cart to user cart when user logs in
  private syncGuestCartToUser(): void {
    const guestCartData = localStorage.getItem(this.CART_STORAGE_KEY);
    if (guestCartData) {
      try {
        const guestItems: CartItemWithProduct[] = JSON.parse(guestCartData);
        if (guestItems.length > 0) {
          // Sync each item to user cart
          guestItems.forEach(item => {
            this.addToUserCart(item.productId, item.quantity).subscribe();
          });
          // Clear guest cart after sync
          localStorage.removeItem(this.CART_STORAGE_KEY);
        }
      } catch (error) {
        console.error('Error syncing guest cart:', error);
      }
    }
    
    // Load user cart
    this.loadUserCart().subscribe();
  }

  // Calculate and update cart summary
  private updateCartSummary(items: CartItemWithProduct[]): void {
    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * this.TAX_RATE;
    const shipping = subtotal >= this.FREE_SHIPPING_THRESHOLD ? 0 : this.SHIPPING_RATE;
    const total = subtotal + tax + shipping;
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);

    const summary: CartSummary = {
      subtotal,
      tax,
      shipping,
      total,
      itemCount
    };

    this.cartSummarySubject.next(summary);
  }

  private handleError(error: any): Observable<never> {
    console.error('Cart Service Error:', error);
    return throwError(() => new Error(
      error.error?.message || 'An error occurred with cart operation'
    ));
  }
}