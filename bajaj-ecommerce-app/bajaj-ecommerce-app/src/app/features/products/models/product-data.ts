export class ProductData {
    _id: string;
    name: string;
    sku: string;
    description: string;
    price: number;
    discount: number;
    categoryId: ProductCategory;
    brand: string;
    images: string[];
    stock: number;
    rating: number;
    numReviews: number;
    attributes: Attribute;
    isFeatured: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class ProductCategory {
    _id: string;
    name: string;
    slug: string;
}

export class Attribute {
    color: string;
    material: string;
    warranty: string;
}

// Enhanced interfaces for filtering and search
export interface ProductFilters {
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    brands?: string[];
    inStock?: boolean;
    isFeatured?: boolean;
    search?: string;
}

export interface ProductSortOptions {
    field: 'price' | 'rating' | 'name' | 'createdAt';
    direction: 'asc' | 'desc';
}

export interface ProductSearchResponse {
    products: ProductData[];
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ProductCreateRequest {
    name: string;
    sku: string;
    description: string;
    price: number;
    discount?: number;
    categoryId: string;
    brand: string;
    images: string[];
    stock: number;
    attributes: Attribute;
    isFeatured?: boolean;
}

export interface ProductUpdateRequest extends Partial<ProductCreateRequest> {
    _id: string;
}