import {Injectable, Injector} from '@angular/core';
import {BehaviorSubject, catchError, Observable, throwError} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {tap} from "rxjs/operators";
import {NotificationService} from "./notification.service";
export interface DecodedToken {
  sub: string; // subject (usually user email or id)
  exp: number; // expiration time
  iat: number; // issued at
  roles?: string[];
  email?: string;
  userId?: string;
  firstName?: string;
  lastName?: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/v1/auth';
  private apiUrl1='http://localhost:8080/api/v1/users'
  private tokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';
  private userKey = 'user';

  private currentUserSubject: BehaviorSubject<any | null>;
  public currentUser$: Observable<any | null>;

  private isAuthenticatedSubject: BehaviorSubject<boolean>;
  public isAuthenticated$: Observable<boolean>;

  constructor(
      private http: HttpClient,
      private router: Router,
      private injector: Injector
  ) {
    // Initialize subjects with values from localStorage
    const storedUser = this.getUserFromStorage();
    this.currentUserSubject = new BehaviorSubject<any | null>(storedUser);
    this.currentUser$ = this.currentUserSubject.asObservable();

    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    // Check token validity on service initialization
    if (this.hasValidToken()) {
      this.loadCurrentUser();
    }
  }

  /**
   * Sign in with email and password
   */
  signin(credentials:any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials)
        .pipe(
            tap(response => {
              this.handleAuthenticationResponse(response);
            }),
            catchError(error => {
              console.error('Login error:', error);
              return throwError(() => error);
            })
        );
  }

  /**
   * Register a new user
   */
  register(data: any): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/register`, data)
        .pipe(
            catchError(error => {
              console.error('Registration error:', error);
              return throwError(() => error);
            })
        );
  }




  /**
   * Refresh the access token using refresh token
   */
  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      this.signout();
      return throwError(() => new Error('No refresh token available'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${refreshToken}`
    });

    return this.http.post<any>(`${this.apiUrl}/refresh`, {}, { headers })
        .pipe(
            tap(response => {
              this.storeTokens(response);
            }),
            catchError(error => {
              console.error('Token refresh error:', error);
              this.signout();
              return throwError(() => error);
            })
        );
  }

  /**
   * Get the current access token
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Get the refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  /**
   * Get the current user
   */
  getCurrentUser(): any | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.hasValidToken();
  }

  /**
   * Check if user has a specific role
   */
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.roles?.includes(role) || false;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    if (!user?.roles) return false;
    return roles.some(role => user.roles!.includes(role));
  }

  /**
   * Handle authentication response
   */
  private handleAuthenticationResponse(response: any): void {
    // Store tokens
    this.storeTokens(response);

    // Decode token to get user info
    const user = this.decodeToken(response.access_token);
    if (user) {
      this.storeUser(user);
      this.currentUserSubject.next(user);
    }

    // Update authentication status
    this.isAuthenticatedSubject.next(true);

    // Load full user profile if needed
    this.loadCurrentUser();
  }

  /**
   * Store tokens in localStorage
   */
  private storeTokens(response: any): void {
    localStorage.setItem(this.tokenKey, response.access_token);
    if (response.refresh_token) {
      localStorage.setItem(this.refreshTokenKey, response.refresh_token);
    }
  }

  /**
   * Store user in localStorage
   */
  private storeUser(user: any): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  /**
   * Get user from localStorage
   */
  private getUserFromStorage(): any | null {
    const userStr = localStorage.getItem(this.userKey);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        console.error('Error parsing stored user:', e);
        return null;
      }
    }
    return null;
  }

  /**
   * Decode JWT token to extract user information
   */
  private decodeToken(token: string): any | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])) as DecodedToken;

      return {
        id: payload.userId || payload.sub,
        email: payload.email || payload.sub,
        firstName: payload.firstName || '',
        lastName: payload.lastName || '',
        phoneNumber: '',
        roles: payload.roles || []
      };
    } catch (e) {
      console.error('Error decoding token:', e);
      return null;
    }
  }

  /**
   * Check if token is valid (not expired)
   */
  private hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1])) as DecodedToken;
      const expirationDate = new Date(payload.exp * 1000);
      return expirationDate > new Date();
    } catch (e) {
      console.error('Error checking token validity:', e);
      return false;
    }
  }

  /**
   * Load current user profile from backend
   */
  private loadCurrentUser(): void {
    // If you have an endpoint to get current user profile
    // Uncomment and adjust this:

    this.http.get<any>(`${this.apiUrl1}/me`)
      .subscribe({
        next: (user) => {
          this.storeUser(user);
          this.currentUserSubject.next(user);
        },
        error: (error) => {
          console.error('Error loading user profile:', error);
        }
      });

  }


  signout(): void {
    // Disconnect notifications using injector to avoid circular dependency
    try {
      const notificationService = this.injector.get(NotificationService);
      notificationService.disconnect();
    } catch (error) {
      console.error('Error disconnecting notifications:', error);
    }

    // Clear storage
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userKey);
    sessionStorage.clear();

    // Update subjects
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);

    // Navigate to login
    this.router.navigate(['/sessions/signin']);
  }
}
