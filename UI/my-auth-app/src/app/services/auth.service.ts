import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private tokenRefreshTimer: any; // Timer for auto-refresh
  private logoutSubject = new Subject<void>(); // Notify components on logout

  constructor(private http: HttpClient) {}

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        this.storeTokens(response.accessToken, response.refreshToken);
        this.scheduleTokenRefresh(); // Start auto-refresh after login
      })
    );
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return of(null);
    }
    return this.http.post(`${this.apiUrl}/refresh`, { refreshToken }).pipe(
      tap((response: any) => {
        this.storeTokens(response.accessToken, response.refreshToken);
        this.scheduleTokenRefresh(); // Reschedule after refresh
      }),
      catchError(() => {
        this.logout(); // Logout if refresh fails
        return of(null);
      })
    );
  }

  private storeTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  isLoggedIn(): boolean {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return false;
    try {
      const decoded: any = jwtDecode(accessToken);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  getUserInfo(): { username: string; exp: number } | null {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return null;
    try {
      const decoded: any = jwtDecode(accessToken);
      return { username: decoded.sub, exp: decoded.exp };
    } catch (error) {
      return null;
    }
  }

  private scheduleTokenRefresh(): void {
    if (this.tokenRefreshTimer) {
      clearTimeout(this.tokenRefreshTimer); // Clear existing timer
    }
    const userInfo = this.getUserInfo();
    if (userInfo) {
      const currentTime = Math.floor(Date.now() / 1000);
      const expiresIn = (userInfo.exp - currentTime - 60) * 1000; // Refresh 1 minute before expiry
      if (expiresIn > 0) {
        this.tokenRefreshTimer = setTimeout(() => {
          this.refreshToken().subscribe();
        }, expiresIn);
      }
    }
  }

  logout(): void {
    if (this.tokenRefreshTimer) {
      clearTimeout(this.tokenRefreshTimer); // Stop timer on logout
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.logoutSubject.next(); // Notify subscribers
  }

  onLogout(): Observable<void> {
    return this.logoutSubject.asObservable();
  }
}