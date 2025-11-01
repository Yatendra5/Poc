import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { catchError } from 'rxjs/operators';

import { ProductListResponse } from '../models/product-list-response';
import { ProductDetailsResponse } from '../models/product-details-response';
import { ProductData } from '../models/product-data';
import { MOCK_PRODUCTS } from './mock-products-data';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsApi {
  private _baseUrl: string = environment.apiBaseUrl;
  private _httpClient = inject(HttpClient);
  
  // Flag to use mock data or real API - now defaults to backend data
  private _useMockData: boolean = environment.useMockData;

  getproducts(): Observable<ProductListResponse> {
    if (this._useMockData) {
      return this._getMockProducts();
    }
    return this._httpClient.get<ProductListResponse>(`${this._baseUrl}/products`)
      .pipe(
        catchError(this._handleError<ProductListResponse>('getproducts'))
      );
  }
  
  getProductsByCategory(categoryId: string): Observable<ProductListResponse> {
    if (this._useMockData) {
      return this._getMockProductsByCategory(categoryId);
    }
    return this._httpClient.get<ProductListResponse>(`${this._baseUrl}/products?categoryId=${categoryId}`)
      .pipe(
        catchError(this._handleError<ProductListResponse>('getProductsByCategory'))
      );
  }
  
  getProductDetails(id: string): Observable<ProductDetailsResponse> {
    if (this._useMockData) {
      return this._getMockProductDetails(id);
    }
    return this._httpClient.get<ProductDetailsResponse>(`${this._baseUrl}/products/${id}`)
      .pipe(
        catchError(this._handleError<ProductDetailsResponse>('getProductDetails'))
      );
  }

  // Mock data methods
  private _getMockProducts(): Observable<ProductListResponse> {
    const response: ProductListResponse = {
      success: true,
      total: MOCK_PRODUCTS.length,
      page: 1,
      pages: 1,
      count: MOCK_PRODUCTS.length,
      data: MOCK_PRODUCTS
    };
    return of(response);
  }

  private _getMockProductsByCategory(categoryId: string): Observable<ProductListResponse> {
    const filteredProducts = MOCK_PRODUCTS.filter(
      product => product.categoryId._id === categoryId
    );
    
    const response: ProductListResponse = {
      success: true,
      total: filteredProducts.length,
      page: 1,
      pages: 1,
      count: filteredProducts.length,
      data: filteredProducts
    };
    return of(response);
  }

  private _getMockProductDetails(id: string): Observable<ProductDetailsResponse> {
    const product = MOCK_PRODUCTS.find(p => p._id === id);
    
    const response: ProductDetailsResponse = {
      success: true,
      data: product || null
    };
    return of(response);
  }

  // Method to get products by category slug
  getProductsByCategorySlug(categorySlug: string): Observable<ProductListResponse> {
    if (this._useMockData) {
      const filteredProducts = MOCK_PRODUCTS.filter(
        product => product.categoryId.slug === categorySlug
      );
      
      const response: ProductListResponse = {
        success: true,
        total: filteredProducts.length,
        page: 1,
        pages: 1,
        count: filteredProducts.length,
        data: filteredProducts
      };
      return of(response);
    }
    return this._httpClient.get<ProductListResponse>(`${this._baseUrl}/products?categorySlug=${categorySlug}`)
      .pipe(
        catchError(this._handleError<ProductListResponse>('getProductsByCategorySlug'))
      );
  }

  // Method to get featured products
  getFeaturedProducts(): Observable<ProductListResponse> {
    if (this._useMockData) {
      const featuredProducts = MOCK_PRODUCTS.filter(product => product.isFeatured);
      
      const response: ProductListResponse = {
        success: true,
        total: featuredProducts.length,
        page: 1,
        pages: 1,
        count: featuredProducts.length,
        data: featuredProducts
      };
      return of(response);
    }
    return this._httpClient.get<ProductListResponse>(`${this._baseUrl}/products?featured=true`)
      .pipe(
        catchError(this._handleError<ProductListResponse>('getFeaturedProducts'))
      );
  }

  // Method to search products by name or description
  searchProducts(query: string): Observable<ProductListResponse> {
    if (this._useMockData) {
      const searchResults = MOCK_PRODUCTS.filter(
        product => 
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          product.brand.toLowerCase().includes(query.toLowerCase())
      );
      
      const response: ProductListResponse = {
        success: true,
        total: searchResults.length,
        page: 1,
        pages: 1,
        count: searchResults.length,
        data: searchResults
      };
      return of(response);
    }
    return this._httpClient.get<ProductListResponse>(`${this._baseUrl}/products?search=${encodeURIComponent(query)}`)
      .pipe(
        catchError(this._handleError<ProductListResponse>('searchProducts'))
      );
  }

  // Method to get products by price range
  getProductsByPriceRange(minPrice: number, maxPrice: number): Observable<ProductListResponse> {
    if (this._useMockData) {
      const filteredProducts = MOCK_PRODUCTS.filter(
        product => product.price >= minPrice && product.price <= maxPrice
      );
      
      const response: ProductListResponse = {
        success: true,
        total: filteredProducts.length,
        page: 1,
        pages: 1,
        count: filteredProducts.length,
        data: filteredProducts
      };
      return of(response);
    }
    return this._httpClient.get<ProductListResponse>(`${this._baseUrl}/products?minPrice=${minPrice}&maxPrice=${maxPrice}`)
      .pipe(
        catchError(this._handleError<ProductListResponse>('getProductsByPriceRange'))
      );
  }

  // Method to toggle between mock and real API
  setUseMockData(useMock: boolean): void {
    this._useMockData = useMock;
  }

  // Method to get all available categories from products
  getProductCategories(): { _id: string; name: string; slug: string; productCount: number }[] {
    const categoryMap = new Map<string, { _id: string; name: string; slug: string; count: number }>();
    
    MOCK_PRODUCTS.forEach(product => {
      const categoryId = product.categoryId._id;
      if (categoryMap.has(categoryId)) {
        categoryMap.get(categoryId)!.count++;
      } else {
        categoryMap.set(categoryId, {
          _id: product.categoryId._id,
          name: product.categoryId.name,
          slug: product.categoryId.slug,
          count: 1
        });
      }
    });

    return Array.from(categoryMap.values()).map(cat => ({
      _id: cat._id,
      name: cat.name,
      slug: cat.slug,
      productCount: cat.count
    }));
  }

  // Error handling method
  private _handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed:`, error);
      
      // Log error to console for debugging
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        console.error('Client-side error:', error.error.message);
      } else {
        // Server-side error
        console.error(
          `Backend returned code ${error.status}, ` +
          `body was: ${error.error}`
        );
      }

      // Return a user-friendly error response
      const errorResponse = {
        success: false,
        message: this._getErrorMessage(error),
        data: result || null,
        total: 0,
        page: 1,
        pages: 0,
        count: 0
      } as T;

      return of(errorResponse);
    };
  }

  private _getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'Unable to connect to the server. Please check your internet connection.';
    } else if (error.status >= 400 && error.status < 500) {
      return error.error?.message || 'Invalid request. Please try again.';
    } else if (error.status >= 500) {
      return 'Server error. Please try again later.';
    } else {
      return 'An unexpected error occurred. Please try again.';
    }
  }
}
