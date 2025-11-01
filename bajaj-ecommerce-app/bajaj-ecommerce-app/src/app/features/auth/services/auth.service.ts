import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { 
  User, 
  UserLogin, 
  UserRegistration, 
  AuthResponse, 
  ForgotPasswordRequest, 
  ResetPasswordRequest,
  UpdateProfileRequest 
} from '../../../shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:9090/api/auth';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';

  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Authentication methods
  login(credentials: UserLogin): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => {
          this.setAuthData(response);
        }),
        catchError(this.handleError)
      );
  }

  register(userData: UserRegistration): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, userData)
      .pipe(
        tap(response => {
          this.setAuthData(response);
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  forgotPassword(request: ForgotPasswordRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API_URL}/forgot-password`, request)
      .pipe(catchError(this.handleError));
  }

  resetPassword(request: ResetPasswordRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API_URL}/reset-password`, request)
      .pipe(catchError(this.handleError));
  }

  // Profile management
  updateProfile(updates: UpdateProfileRequest): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/profile`, updates, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(user => {
        this.updateUserInStorage(user);
        this.currentUserSubject.next(user);
      }),
      catchError(this.handleError)
    );
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/profile`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  // Utility methods
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'admin';
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private setAuthData(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }

  private getUserFromStorage(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  private updateUserInStorage(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    console.error('Auth Service Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}