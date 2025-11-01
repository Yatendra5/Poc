import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SideNavService } from '../../services/side-nav.service';
import { AuthService } from '../../../features/auth/services/auth.service';
import { CartService } from '../../services/cart.service';
import { User } from '../../models/user';
import { Observable } from 'rxjs';

@Component({
  selector: 'bajaj-nav-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})
export class NavBar implements OnInit {
  protected searchQuery: string = '';
  protected sideNavService = inject(SideNavService);
  
  currentUser$: Observable<User | null>;
  cartCount$: Observable<number>;
  
  constructor(
    private authService: AuthService,
    private cartService: CartService
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.cartCount$ = this.cartService.getCartCount();
  }

  ngOnInit(): void {}

  onSearch() {
    if (this.searchQuery.trim()) {
      console.log('Search for:', this.searchQuery);
      // TODO: Implement product search
    }
  }

  toggleSideNav() {
    this.sideNavService.toggleNav();
  }

  logout() {
    this.authService.logout();
  }
}
