import { Injectable, inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";

import { Category } from '../models/category';

export interface CategoriesResponse {
  success: boolean;
  message: string;
  data: Category[];
}

// Mock categories data from your backend
const MOCK_CATEGORIES: Category[] = [
  {
    "_id": "68fb559922793d723db16da8",
    "name": "Electronics",
    "slug": "electronics",
    "parentId": null,
    "image": "https://picsum.photos/seed/G5AFV/640/480?blur=2",
    "__v": 0,
    "createdAt": new Date("2025-10-24T10:31:53.952Z"),
    "updatedAt": new Date("2025-10-24T10:31:53.952Z")
  },
  {
    "_id": "68fb559922793d723db16da9",
    "name": "Fashion",
    "slug": "fashion",
    "parentId": null,
    "image": "https://picsum.photos/seed/lY3Hvj7/640/480",
    "__v": 0,
    "createdAt": new Date("2025-10-24T10:31:53.954Z"),
    "updatedAt": new Date("2025-10-24T10:31:53.954Z")
  },
  {
    "_id": "68fb559922793d723db16daa",
    "name": "Home & Kitchen",
    "slug": "home-kitchen",
    "parentId": null,
    "image": "https://picsum.photos/seed/HshJjxbqBT/640/480",
    "__v": 0,
    "createdAt": new Date("2025-10-24T10:31:53.954Z"),
    "updatedAt": new Date("2025-10-24T10:31:53.954Z")
  },
  {
    "_id": "68fb559922793d723db16dab",
    "name": "Sports & Fitness",
    "slug": "sports-fitness",
    "parentId": null,
    "image": "https://picsum.photos/seed/PRa5eWi/640/480?grayscale&blur=9",
    "__v": 0,
    "createdAt": new Date("2025-10-24T10:31:53.954Z"),
    "updatedAt": new Date("2025-10-24T10:31:53.954Z")
  },
  {
    "_id": "68fb559922793d723db16dac",
    "name": "Beauty & Health",
    "slug": "beauty-health",
    "parentId": null,
    "image": "https://picsum.photos/seed/Qd4IiKesyA/640/480?grayscale&blur=1",
    "__v": 0,
    "createdAt": new Date("2025-10-24T10:31:53.954Z"),
    "updatedAt": new Date("2025-10-24T10:31:53.954Z")
  },
  {
    "_id": "68fb559922793d723db16dad",
    "name": "Books & Stationery",
    "slug": "books-stationery",
    "parentId": null,
    "image": "https://picsum.photos/seed/bvj2itn4HP/640/480?blur=2",
    "__v": 0,
    "createdAt": new Date("2025-10-24T10:31:53.954Z"),
    "updatedAt": new Date("2025-10-24T10:31:53.954Z")
  },
  {
    "_id": "68fb559922793d723db16dae",
    "name": "Toys & Baby",
    "slug": "toys-baby",
    "parentId": null,
    "image": "https://picsum.photos/seed/HHIUv/640/480?blur=2",
    "__v": 0,
    "createdAt": new Date("2025-10-24T10:31:53.954Z"),
    "updatedAt": new Date("2025-10-24T10:31:53.954Z")
  },
  {
    "_id": "68fb559922793d723db16daf",
    "name": "Groceries",
    "slug": "groceries",
    "parentId": null,
    "image": "https://picsum.photos/seed/EjaPVqmI/640/480?grayscale&blur=9",
    "__v": 0,
    "createdAt": new Date("2025-10-24T10:31:53.954Z"),
    "updatedAt": new Date("2025-10-24T10:31:53.954Z")
  },
  {
    "_id": "68fb559922793d723db16db0",
    "name": "Automotive",
    "slug": "automotive",
    "parentId": null,
    "image": "https://picsum.photos/seed/EbWjtrVzf/640/480?grayscale&blur=2",
    "__v": 0,
    "createdAt": new Date("2025-10-24T10:31:53.954Z"),
    "updatedAt": new Date("2025-10-24T10:31:53.954Z")
  },
  {
    "_id": "68fb559922793d723db16db1",
    "name": "Jewellery",
    "slug": "jewellery",
    "parentId": null,
    "image": "https://picsum.photos/seed/tHdB0AH3/640/480?blur=10",
    "__v": 0,
    "createdAt": new Date("2025-10-24T10:31:53.955Z"),
    "updatedAt": new Date("2025-10-24T10:31:53.955Z")
  }
];

@Injectable({
  providedIn: 'root'
})
export class CategoriesApi {
  private _baseUrl: string = "http://localhost:9090/api";
  private _httpClient = inject(HttpClient);
  
  // Flag to use mock data or real API
  private _useMockData: boolean = true;

  getCategories(): Observable<CategoriesResponse> {
    if (this._useMockData) {
      return this._getMockCategories();
    }
    return this._httpClient.get<CategoriesResponse>(`${this._baseUrl}/categories`);
  }

  getCategoryById(id: string): Observable<{success: boolean, message: string, data: Category | null}> {
    if (this._useMockData) {
      return this._getMockCategoryById(id);
    }
    return this._httpClient.get<{success: boolean, message: string, data: Category}>(`${this._baseUrl}/categories/${id}`);
  }

  getCategoryBySlug(slug: string): Observable<{success: boolean, message: string, data: Category | null}> {
    if (this._useMockData) {
      return this._getMockCategoryBySlug(slug);
    }
    return this._httpClient.get<{success: boolean, message: string, data: Category}>(`${this._baseUrl}/categories/slug/${slug}`);
  }

  // Mock data methods
  private _getMockCategories(): Observable<CategoriesResponse> {
    const response: CategoriesResponse = {
      success: true,
      message: "Categories retrieved successfully",
      data: MOCK_CATEGORIES
    };
    return of(response);
  }

  private _getMockCategoryById(id: string): Observable<{success: boolean, message: string, data: Category | null}> {
    const category = MOCK_CATEGORIES.find(cat => cat._id === id);
    
    const response = {
      success: true,
      message: category ? "Category found" : "Category not found",
      data: category || null
    };
    return of(response);
  }

  private _getMockCategoryBySlug(slug: string): Observable<{success: boolean, message: string, data: Category | null}> {
    const category = MOCK_CATEGORIES.find(cat => cat.slug === slug);
    
    const response = {
      success: true,
      message: category ? "Category found" : "Category not found",
      data: category || null
    };
    return of(response);
  }

  // Method to toggle between mock and real API
  setUseMockData(useMock: boolean): void {
    this._useMockData = useMock;
  }

  // Static method to get mock categories (useful for direct access)
  static getMockCategories(): Category[] {
    return MOCK_CATEGORIES;
  }
}