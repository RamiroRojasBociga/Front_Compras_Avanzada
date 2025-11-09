import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

// Define la estructura de la petición de login
export interface LoginRequest {
  email: string;
  password: string;
}

// Define la estructura de la respuesta del backend
export interface LoginResponse {
  mensaje: string;
  token: string;
}

// Servicio de autenticación que maneja login, token y estado del usuario
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // URL del endpoint de login en el backend
  private apiUrl = `${environment.apiUrl}/auth/login`;
  
  // BehaviorSubject que emite true si hay un token válido, false si no
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  
  // Observable público que otros componentes pueden suscribirse
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) { }

  // Hace login y guarda el token en localStorage
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, credentials).pipe(
      tap(response => {
        // Si el backend devuelve un token, lo guardamos
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.isLoggedInSubject.next(true);
        }
      })
    );
  }

  // Cierra sesión y elimina el token
  logout(): void {
    localStorage.removeItem('token');
    this.isLoggedInSubject.next(false);
  }

  // Devuelve el token guardado en localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Verifica si hay un token guardado
  hasToken(): boolean {
    return !!this.getToken();
  }

  // Verifica si el usuario está autenticado
  isAuthenticated(): boolean {
    return this.hasToken();
  }
}
