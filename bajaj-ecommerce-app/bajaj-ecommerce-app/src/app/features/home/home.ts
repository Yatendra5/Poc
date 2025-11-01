import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { Slider } from '../../shared/components/slider/slider';
import { CategoriesApi } from '../categories/services/categories-api';
import { ProductsApi } from '../products/services/products-api';
import { Category } from '../categories/models/category';
import { ProductData } from '../products/models/product-data';
import { CartService } from '../../shared/services/cart.service';

@Component({
  selector: 'bajaj-home',
  standalone: true,
  imports: [CommonModule, RouterModule, Slider],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit, OnDestroy {
  private _categoriesApi = inject(CategoriesApi);
  private _productsApi = inject(ProductsApi);
  private _cartService = inject(CartService);
  private _subscription = new Subscription();

  protected categories = signal<Category[]>([]);
  protected featuredProducts = signal<ProductData[]>([]);
  protected isLoadingCategories = signal<boolean>(false);
  protected isLoadingProducts = signal<boolean>(false);
  protected addingToCart = signal<Set<string>>(new Set());
  protected categoriesError = signal<boolean>(false);
  protected productsError = signal<boolean>(false);
  protected categoriesErrorMessage = signal<string>('');
  protected productsErrorMessage = signal<string>('');

  ngOnInit(): void {
    this.loadCategories();
    this.loadFeaturedProducts();
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  private loadCategories(): void {
    this.isLoadingCategories.set(true);
    this.categoriesError.set(false);
    this.categoriesErrorMessage.set('');
    
    this._subscription.add(
      this._categoriesApi.getCategories().subscribe({
        next: (response) => {
          if (response.success) {
            // Take first 6 categories for home page
            this.categories.set(response.data.slice(0, 6));
          } else {
            this.categoriesError.set(true);
            this.categoriesErrorMessage.set((response as any).message || 'Failed to load categories.');
          }
          this.isLoadingCategories.set(false);
        },
        error: (error) => {
          console.error('Error loading categories:', error);
          this.categoriesError.set(true);
          this.categoriesErrorMessage.set('Failed to load categories. Please try again.');
          this.isLoadingCategories.set(false);
        }
      })
    );
  }

  private loadFeaturedProducts(): void {
    this.isLoadingProducts.set(true);
    this.productsError.set(false);
    this.productsErrorMessage.set('');
    
    this._subscription.add(
      this._productsApi.getFeaturedProducts().subscribe({
        next: (response) => {
          if (response.success) {
            // Take first 8 featured products for home page
            this.featuredProducts.set(response.data.slice(0, 8));
          } else {
            this.productsError.set(true);
            this.productsErrorMessage.set((response as any).message || 'Failed to load featured products.');
          }
          this.isLoadingProducts.set(false);
        },
        error: (error) => {
          console.error('Error loading featured products:', error);
          this.productsError.set(true);
          this.productsErrorMessage.set('Failed to load featured products. Please try again.');
          this.isLoadingProducts.set(false);
        }
      })
    );
  }

  protected getCategoryIcon(categoryName: string): string {
    const iconMap: { [key: string]: string } = {
      'Electronics': '🖥️',
      'Fashion': '👕',
      'Home & Kitchen': '🏠',
      'Sports & Fitness': '⚽',
      'Beauty & Health': '💄',
      'Books & Stationery': '📚',
      'Toys & Baby': '🎮',
      'Groceries': '🛒',
      'Automotive': '🚗',
      'Jewellery': '💎'
    };
    return iconMap[categoryName] || '📦';
  }

  protected getDiscountedPrice(price: number, discount: number): number {
    return Math.round(price * (1 - discount / 100));
  }

  protected getStarArray(rating: number): number[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(1); // Full star
      } else if (i === fullStars && rating % 1 !== 0) {
        stars.push(0.5); // Half star
      } else {
        stars.push(0); // Empty star
      }
    }
    return stars;
  }

  protected addToCart(product: ProductData, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    
    if (this.addingToCart().has(product._id)) return;
    
    const updatedAdding = new Set(this.addingToCart());
    updatedAdding.add(product._id);
    this.addingToCart.set(updatedAdding);
    
    this._cartService.addToCart(product, 1).subscribe({
      next: () => {
        const updatedAdding = new Set(this.addingToCart());
        updatedAdding.delete(product._id);
        this.addingToCart.set(updatedAdding);
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        const updatedAdding = new Set(this.addingToCart());
        updatedAdding.delete(product._id);
        this.addingToCart.set(updatedAdding);
      }
    });
  }

  protected isAddingToCart(productId: string): boolean {
    return this.addingToCart().has(productId);
  }

  protected retryLoadCategories(): void {
    this.loadCategories();
  }

  protected retryLoadFeaturedProducts(): void {
    this.loadFeaturedProducts();
  }
}