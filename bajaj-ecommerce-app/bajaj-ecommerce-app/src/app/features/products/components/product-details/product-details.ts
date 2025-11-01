import { Component, inject, Input, OnInit, OnDestroy, OnChanges, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Subscription } from "rxjs";

import { ProductDetailsResponse } from "../../models/product-details-response";
import { ProductsApi } from "../../services/products-api";
import { CartService } from "../../../../shared/services/cart.service";

@Component({
  selector: 'bajaj-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit, OnDestroy, OnChanges {
  private _productsApi = inject(ProductsApi);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _cartService = inject(CartService);
  private _subscription = new Subscription();
  
  protected product: ProductDetailsResponse;
  protected isLoading = false;
  protected hasError = false;
  protected errorMessage = '';
  protected quantity = 1;
  protected selectedImage = signal<string | null>(null);
  
  protected get productData() {
    return this.product?.data;
  }
  
  @Input() public productId: string;

  ngOnInit() {
    // Get product ID from route params if not provided as input
    this._subscription.add(
      this._route.params.subscribe((params) => {
        if (params['id']) {
          this.productId = params['id'];
          this.loadProductDetails();
        } else if (this.productId) {
          this.loadProductDetails();
        }
      })
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['productId'] && !changes['productId'].firstChange) {
      this.loadProductDetails();
    }
  }

  protected loadProductDetails(): void {
    if (!this.productId) return;
    
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = '';
    
    this._subscription.add(
      this._productsApi.getProductDetails(this.productId).subscribe({
        next: (response) => {
          this.product = response;
          this.isLoading = false;
          
          // Check if the API response indicates an error
          if (!response.success || !response.data) {
            this.hasError = true;
            this.errorMessage = (response as any).message || 'Product not found or could not be loaded.';
          } else {
            this.selectedImage.set(null); // Reset selected image
          }
          
          console.log(this.product);
        },
        error: (error) => {
          console.error('Error loading product:', error);
          this.isLoading = false;
          this.hasError = true;
          this.errorMessage = 'Failed to load product details. Please try again.';
        }
      })
    );
  }

  protected selectImage(image: string): void {
    this.selectedImage.set(image);
  }

  /**
   * Generate star array for displaying rating
   * Returns array where 1 = full star, 0.5 = half star, 0 = empty star
   */
  protected getStarArray(rating: number): number[] {
    const stars: number[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(1);
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(0.5);
    }

    // Add empty stars to reach 5
    while (stars.length < 5) {
      stars.push(0);
    }

    return stars;
  }

  /**
   * Calculate discounted price
   */
  protected getDiscountedPrice(price: number, discount: number): number {
    return price - (price * discount) / 100;
  }

  /**
   * Calculate savings amount
   */
  protected getSavings(price: number, discount: number): number {
    return (price * discount) / 100;
  }

  protected increaseQuantity(): void {
    if (this.quantity < 10) {
      this.quantity++;
    }
  }

  protected decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  protected addToCart(): void {
    if (!this.product?.data) {
      console.error('No product data available');
      return;
    }

    const productData = this.product.data;
    
    if (productData.stock <= 0) {
      console.error('Product is out of stock');
      return;
    }

    console.log(`Adding ${this.quantity} of product ${productData.name} to cart`);
    
    this._subscription.add(
      this._cartService.addToCart(productData, this.quantity).subscribe({
        next: () => {
          console.log('✅ Successfully added to cart');
          // Optionally show a success message or redirect
          alert(`✅ Successfully added "${productData.name}" to cart!`);
        },
        error: (error) => {
          console.error('❌ Failed to add to cart:', error);
          alert(`❌ Failed to add "${productData.name}" to cart. Please try again.`);
        }
      })
    );
  }

  protected goBack(): void {
    this._router.navigate(['/products']);
  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
