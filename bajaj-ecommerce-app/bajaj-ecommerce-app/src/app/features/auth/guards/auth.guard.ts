import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // Store the attempted URL for redirecting after login
    this.router.navigate(['/auth/login'], { 
      queryParams: { returnUrl: state.url } 
    });
    
    return false;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    if (this.authService.isAuthenticated() && this.authService.isAdmin()) {
      return true;
    }

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
    } else {
      this.router.navigate(['/']); // Redirect non-admin users to home
    }
    
    return false;
  }
}