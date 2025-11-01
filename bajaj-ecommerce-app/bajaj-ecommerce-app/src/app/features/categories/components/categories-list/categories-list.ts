import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { CategoriesApi } from '../../services/categories-api';
import { Category } from '../../models/category';
import { Banner } from '../../../../shared/components/banner/banner';

@Component({
  selector: 'bajaj-categories-list',
  standalone: true,
  imports: [CommonModule, RouterModule, Banner],
  templateUrl: './categories-list.html',
  styleUrl: './categories-list.css',
})
export class CategoriesList implements OnInit, OnDestroy {
  private _categoriesApi = inject(CategoriesApi);
  private _router = inject(Router);
  protected categories = signal<Category[]>([]);
  protected isLoading = signal<boolean>(false);
  private _subscription = new Subscription();

  ngOnInit(): void {
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  private loadCategories(): void {
    this.isLoading.set(true);
    this._subscription.add(
      this._categoriesApi.getCategories().subscribe({
        next: (response) => {
          if (response.success) {
            this.categories.set(response.data);
          }
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      })
    );
  }

  // Navigate to product list filtered by selected category
  protected navigateToCategory(category: Category): void {
    this._router.navigate(['/products'], {
      queryParams: { categoryId: category._id },
    });
  }
}
