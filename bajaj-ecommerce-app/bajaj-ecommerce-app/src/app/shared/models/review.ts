export interface Review {
  _id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    name: string;
  };
}

export interface ReviewCreateRequest {
  productId: string;
  rating: number;
  comment: string;
}

export interface ProductReviewsResponse {
  reviews: Review[];
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    [key: number]: number;
  };
}