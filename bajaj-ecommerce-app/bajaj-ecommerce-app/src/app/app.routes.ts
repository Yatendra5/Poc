import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { ProductsList } from './features/products/components/products-list/products-list';
import { ProductDetails } from './features/products/components/product-details/product-details';
import { CategoriesList } from './features/categories/components/categories-list/categories-list';
import { LoginComponent } from './features/auth/components/login/login.component';
import { RegisterComponent } from './features/auth/components/register/register.component';
import { CartComponent } from './features/cart/components/cart/cart.component';
import { AuthGuard, AdminGuard } from './features/auth/guards/auth.guard';

export const appRoutes: Routes = [
  // Home route
  {
    path: '',
    component: Home,
  },

  // Auth & Users routes (API endpoints 1-4)
  {
    path: 'auth/login',
    component: LoginComponent,
  },
  {
    path: 'auth/register',
    component: RegisterComponent,
  },
  {
    path: 'auth/me',
    loadComponent: () => import('./features/auth/components/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    redirectTo: 'auth/me'
  },

  // Categories routes (API endpoints 5-8)
  {
    path: 'categories',
    component: CategoriesList,
  },
  {
    path: 'categories/:id',
    loadComponent: () => import('./features/categories/components/category-details/category-details').then(m => m.CategoryDetails),
  },
  
  // Admin category management routes
  {
    path: 'admin/categories/new',
    loadComponent: () => import('./features/categories/components/register-category/register-category').then(m => m.RegisterCategory),
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/categories/:id/edit',
    loadComponent: () => import('./features/categories/components/register-category/register-category').then(m => m.RegisterCategory),
    canActivate: [AdminGuard]
  },

  // Products routes (API endpoints 9-13)
  {
    path: 'products',
    component: ProductsList,
  },
  {
    path: 'products/category/:categoryId',
    component: ProductsList,
  },
  {
    path: 'products/:id',
    component: ProductDetails,
  },
  
  // Admin product management routes
  {
    path: 'admin/products',
    component: ProductsList,
    canActivate: [AdminGuard],
    data: { adminView: true }
  },
  {
    path: 'admin/products/new',
    loadComponent: () => import('./features/products/components/register-product/register-product').then(m => m.RegisterProduct),
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/products/:id/edit',
    loadComponent: () => import('./features/products/components/register-product/register-product').then(m => m.RegisterProduct),
    canActivate: [AdminGuard]
  },

  // Orders routes (API endpoints 14-18)
  {
    path: 'orders',
    loadComponent: () => import('./features/orders/components/order-history/order-history.component').then(m => m.OrderHistoryComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'orders/my',
    redirectTo: 'orders'
  },
  {
    path: 'orders/:id',
    loadComponent: () => import('./features/orders/components/order-history/order-history.component').then(m => m.OrderHistoryComponent),
    canActivate: [AuthGuard]
  },
  
  // Admin orders management
  {
    path: 'admin/orders',
    loadComponent: () => import('./features/orders/components/order-history/order-history.component').then(m => m.OrderHistoryComponent),
    canActivate: [AdminGuard],
    data: { adminView: true }
  },

  // Cart routes (API endpoints 19-21)
  {
    path: 'cart',
    component: CartComponent
  },

  // Checkout route (API endpoint 14)
  {
    path: 'checkout',
    loadComponent: () => import('./features/checkout/components/checkout/checkout.component').then(m => m.CheckoutComponent),
    canActivate: [AuthGuard]
  },

  // Reviews are handled within product details component (API endpoints 22-23)
  {
    path: 'products/:productId/reviews',
    redirectTo: 'products/:productId'
  },

  // Admin Dashboard route (API endpoint 24)
  {
    path: 'admin',
    redirectTo: 'admin/dashboard'
  },
  

  // Admin users management route (API endpoint 4)
  {
    path: 'admin/users',
    loadComponent: () => import('./features/auth/components/users-list/users-list.component').then(m => m.UsersListComponent),
    canActivate: [AdminGuard]
  },

  // Wildcard route - must be last
  {
    path: '**',
    redirectTo: '',
  },
];