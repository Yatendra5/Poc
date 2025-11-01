import { Component, signal, inject, OnInit, OnDestroy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { SideNavService } from '../../services/side-nav.service';
import { CategoriesApi } from '../../../features/categories/services/categories-api';
import { Category } from '../../../features/categories/models/category';
import { AuthService } from '../../../features/auth/services/auth.service'; // ✅ <-- You must have this service

@Component({
  selector: 'bajaj-side-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.css',
})
export class SideNav implements OnInit, OnDestroy {
  protected sideNavService = inject(SideNavService);
  private categoriesApi = inject(CategoriesApi);
  private authService = inject(AuthService); // ✅ inject your Auth service

  isOpen = this.sideNavService.isOpen;

  categories = signal<Category[]>([]);
  isLoading = signal(false);
  expandedCategory = signal<string | null>(null);
  private subscription = new Subscription();

  // ✅ reactive user and admin flag
protected isAdmin:boolean = this.authService.isAdmin();

  ngOnInit() {
    // Close side nav on desktop by default
    if (window.innerWidth >= 992) {
      this.sideNavService.closeNav();
    }
    this.loadCategories();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private loadCategories() {
    this.isLoading.set(true);
    this.subscription.add(
      this.categoriesApi.getCategories().subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.categories.set(response.data);
          }
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading categories:', error);
          this.isLoading.set(false);
        },
      })
    );
  }

  toggleNav() {
    this.sideNavService.toggleNav();
  }

  closeNav() {
    this.sideNavService.closeNav();
  }

  toggleCategory(categoryId: string) {
    this.expandedCategory.set(
      this.expandedCategory() === categoryId ? null : categoryId
    );
  }

  navigateToCategory(categoryId: string) {
    this.closeNav();
    window.location.href = `/products?categoryId=${categoryId}`;
  }

  navigateToGroupedView() {
    this.closeNav();
    window.location.href = '/categories';
  }

  trackByCategory(index: number, category: Category): string {
    return category._id;
  }
}
