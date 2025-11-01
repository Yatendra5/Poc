import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth token from the service
    const authToken = this.authService.getToken();
    
    // Clone the request and add the authorization header if token exists
    let authRequest = req;
    if (authToken) {
      authRequest = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${authToken}`)
      });
    }

    // Handle the request
    return next.handle(authRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 errors by logging out and redirecting to login
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/auth/login']);
        }
        
        return throwError(() => error);
      })
    );
  }
}