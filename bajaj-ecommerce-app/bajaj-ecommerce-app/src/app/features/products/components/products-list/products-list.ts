import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ProductsApi } from '../../services/products-api';
import { ProductListResponse } from "../../models/product-list-response";
import { ProductData } from "../../models/product-data";
import { ProductDetails } from '../product-details/product-details';
import { Banner } from '../../../../shared/components/banner/banner';
import { CartService } from '../../../../shared/services/cart.service';

@Component({
  selector: 'bajaj-products-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProductDetails, Banner],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css',
})
export class ProductsList implements OnInit, OnDestroy {
  private _productApi = inject(ProductsApi);
  private _route = inject(ActivatedRoute);
  private _cartService = inject(CartService);
  protected title = signal<string>("All Products");
  protected product: ProductListResponse;
  private _subscription = new Subscription();
  protected selectedProductId: string;
  protected wishlist = signal<Set<string>>(new Set());
  protected Math = Math; // Expose Math to template
  protected addingToCart = signal<Set<string>>(new Set());
  protected hasError = signal<boolean>(false);
  protected errorMessage = signal<string>('');
  
  // Category-wise display
  protected categoryId = signal<string | null>(null);
  protected productsByCategory = signal<{[key: string]: ProductData[]}>({});
  protected uniqueCategories = signal<{_id: string, name: string}[]>([]);
  protected groupByCategory = signal<boolean>(false);
  
  // Pagination signals
  protected currentPage = signal(1);
  protected itemsPerPage = signal(10);
  protected totalItems = signal(0);
  protected isLoading = signal(false);

  ngOnInit(): void {
    // Subscribe to route parameters to handle category filtering
    this._subscription.add(
      this._route.queryParams.subscribe(params => {
        const categoryId = params['categoryId'];
        const groupByCategory = params['groupByCategory'] === 'true';
        
        this.categoryId.set(categoryId || null);
        this.groupByCategory.set(groupByCategory);
        
        if (categoryId) {
          this.title.set("Products by Category");
          this.loadProductsByCategory(categoryId);
        } else if (groupByCategory) {
          this.title.set("Products by Categories");
          this.loadProductsGroupedByCategory();
        } else {
          this.title.set("All Products");
          this.loadProducts();
        }
      })
    );
  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  protected loadProducts(): void {
    this.isLoading.set(true);
    this.hasError.set(false);
    this.errorMessage.set('');
    
    this._subscription.add(
      this._productApi.getproducts().subscribe({
        next: (data) => {
          if (!data.success || !data.data) {
            this.hasError.set(true);
            this.errorMessage.set((data as any).message || 'Failed to load products.');
          } else {
            this.product = data;
            this.totalItems.set(data.data.length);
          }
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading products:', error);
          this.hasError.set(true);
          this.errorMessage.set('Failed to load products. Please try again.');
          this.isLoading.set(false);
        }
      })
    );
  }

  protected loadProductsByCategory(categoryId: string): void {
    this.isLoading.set(true);
    this.hasError.set(false);
    this.errorMessage.set('');
    
    this._subscription.add(
      this._productApi.getProductsByCategory(categoryId).subscribe({
        next: (data) => {
          if (!data.success || !data.data) {
            this.hasError.set(true);
            this.errorMessage.set((data as any).message || 'Failed to load products for this category.');
          } else {
            this.product = data;
            this.totalItems.set(data.data.length);
          }
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading products by category:', error);
          this.hasError.set(true);
          this.errorMessage.set('Failed to load products for this category. Please try again.');
          this.isLoading.set(false);
        }
      })
    );
  }

  protected loadProductsGroupedByCategory(): void {
    this.isLoading.set(true);
    this.hasError.set(false);
    this.errorMessage.set('');
    
    this._subscription.add(
      this._productApi.getproducts().subscribe({
        next: (data) => {
          if (!data.success || !data.data) {
            this.hasError.set(true);
            this.errorMessage.set((data as any).message || 'Failed to load products for grouping.');
          } else {
            this.product = data;
            this.totalItems.set(data.data.length);
            this.groupProductsByCategory(data.data);
          }
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading products for grouping:', error);
          this.hasError.set(true);
          this.errorMessage.set('Failed to load products for grouping. Please try again.');
          this.isLoading.set(false);
        }
      })
    );
  }

  private groupProductsByCategory(products: ProductData[]): void {
    const grouped: {[key: string]: ProductData[]} = {};
    const categories: {_id: string, name: string}[] = [];
    const seenCategories = new Set<string>();

    products.forEach(product => {
      const categoryId = product.categoryId._id;
      const categoryName = product.categoryId.name;
      
      if (!grouped[categoryId]) {
        grouped[categoryId] = [];
      }
      grouped[categoryId].push(product);
      
      if (!seenCategories.has(categoryId)) {
        categories.push({ _id: categoryId, name: categoryName });
        seenCategories.add(categoryId);
      }
    });

    this.productsByCategory.set(grouped);
    this.uniqueCategories.set(categories);
  }

  protected onProductSelection(id: string): void {
    this.selectedProductId = id;
  }

  protected get paginatedProducts() {
    if (!this.product?.data) return [];
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.product.data.slice(start, end);
  }

  protected getCategoryProducts(categoryId: string): ProductData[] {
    return this.productsByCategory()[categoryId] || [];
  }

  protected getPaginatedCategoryProducts(categoryId: string): ProductData[] {
    const products = this.getCategoryProducts(categoryId);
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return products.slice(start, end);
  }

  protected get totalPages(): number {
    return Math.ceil(this.totalItems() / this.itemsPerPage());
  }

  protected goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage.set(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  protected nextPage(): void {
    if (this.currentPage() < this.totalPages) {
      this.goToPage(this.currentPage() + 1);
    }
  }

  protected previousPage(): void {
    if (this.currentPage() > 1) {
      this.goToPage(this.currentPage() - 1);
    }
  }

  protected getPageNumbers(): number[] {
    const pages: number[] = [];
    const totalPages = this.totalPages;
    const current = this.currentPage();
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (current >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = current - 2; i <= current + 2; i++) {
          pages.push(i);
        }
      }
    }
    return pages;
  }

  // Helper methods for Amazon-like features
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

  protected toggleWishlist(productId: string, event: Event): void {
    event.stopPropagation();
    const updatedWishlist = new Set(this.wishlist());
    if (updatedWishlist.has(productId)) {
      updatedWishlist.delete(productId);
    } else {
      updatedWishlist.add(productId);
    }
    this.wishlist.set(updatedWishlist);
  }

  protected isInWishlist(productId: string): boolean {
    return this.wishlist().has(productId);
  }

  protected getStockStatus(stock: number): { label: string; class: string } {
    if (stock === 0) {
      return { label: 'Out of Stock', class: 'stock-out' };
    } else if (stock < 5) {
      return { label: `Only ${stock} left!`, class: 'stock-low' };
    }
    return { label: 'In Stock', class: 'stock-available' };
  }

  protected setViewMode(mode: 'all' | 'grouped'): void {
    if (mode === 'all') {
      window.location.href = '/products';
    } else if (mode === 'grouped') {
      window.location.href = '/products?groupByCategory=true';
    }
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
        
        // Show success feedback
        this.showSuccessMessage(`"${product.name}" added to cart successfully!`);
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        const updatedAdding = new Set(this.addingToCart());
        updatedAdding.delete(product._id);
        this.addingToCart.set(updatedAdding);
        
        // Show error feedback
        this.showErrorMessage(`Failed to add "${product.name}" to cart. Please try again.`);
      }
    });
  }
  
  private showSuccessMessage(message: string): void {
    // Simple alert for now - could be enhanced with a toast library
    alert(`✅ ${message}`);
  }
  
  private showErrorMessage(message: string): void {
    // Simple alert for now - could be enhanced with a toast library
    alert(`❌ ${message}`);
  }

  protected isAddingToCart(productId: string): boolean {
    return this.addingToCart().has(productId);
  }

  protected retryLoad(): void {
    const categoryId = this.categoryId();
    const groupByCategory = this.groupByCategory();
    
    if (categoryId) {
      this.loadProductsByCategory(categoryId);
    } else if (groupByCategory) {
      this.loadProductsGroupedByCategory();
    } else {
      this.loadProducts();
    }
  }
}
