import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { User, LoginCredentials, RegisterData } from '../models';
import { environment } from '../../environments/environment';

interface UsuarioBackend {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  createdAt?: string;
  rol: 'ADMIN' | 'CLIENTE';
}

interface AuthResponseBackend {
  token: string;
  tipo: string;
  expiraEnMs: number;
  usuario: UsuarioBackend;
}

/**
 * Igual que ProductService: se conservó la misma API pública que la
 * versión mock (login, register, demoLogin, logout, isLoggedIn,
 * currentUser) para no tener que tocar auth.component.ts ni
 * header.component.ts. La diferencia es que ahora login/register hacen
 * una petición real al backend y devuelven un JWT válido, que se guarda
 * en localStorage y se usa en cada request gracias a jwtInterceptor.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly tokenKey = 'croche_token';
  private readonly userKey = 'croche_auth_user';
  private readonly rolKey = 'croche_rol';

  readonly currentUser = signal<User | null>(this.loadUserFromStorage());
  readonly cargando = signal<boolean>(false);
  readonly errorAuth = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  private loadUserFromStorage(): User | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    try {
      const data = localStorage.getItem(this.userKey);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  private guardarSesion(resp: AuthResponseBackend): void {
    const user: User = {
      id: resp.usuario.id,
      name: resp.usuario.name,
      email: resp.usuario.email,
      phone: resp.usuario.phone,
      city: resp.usuario.city,
      createdAt: resp.usuario.createdAt
    };

    this.currentUser.set(user);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, resp.token);
      localStorage.setItem(this.rolKey, resp.usuario.rol);
      localStorage.setItem(this.userKey, JSON.stringify(user));
    }
  }

  /** Login real contra POST /api/auth/login. */
  login(credentials: LoginCredentials): void {
    this.cargando.set(true);
    this.errorAuth.set(null);

    this.http.post<AuthResponseBackend>(`${environment.apiUrl}/auth/login`, {
      email: credentials.email,
      password: credentials.password
    }).subscribe({
      next: (resp) => {
        this.guardarSesion(resp);
        this.cargando.set(false);
      },
      error: (err) => {
        this.errorAuth.set(err?.error?.mensaje ?? 'Correo o contraseña incorrectos');
        this.cargando.set(false);
      }
    });
  }

  /**
   * Acceso rápido de demostración: inicia sesión con el usuario demo
   * sembrado en la base de datos (ver db/schema.sql), en vez de simular
   * el login localmente como hacía la versión anterior.
   */
  demoLogin(): void {
    this.login({ email: 'camila@crocheconamor.com', password: 'Demo1234!' });
  }

  /** Registro real contra POST /api/auth/register. */
  register(data: RegisterData): void {
    this.cargando.set(true);
    this.errorAuth.set(null);

    this.http.post<AuthResponseBackend>(`${environment.apiUrl}/auth/register`, {
      name: data.name,
      email: data.email,
      phone: data.phone,
      city: data.city,
      password: data.password
    }).subscribe({
      next: (resp) => {
        this.guardarSesion(resp);
        this.cargando.set(false);
      },
      error: (err) => {
        this.errorAuth.set(err?.error?.mensaje ?? 'No se pudo completar el registro');
        this.cargando.set(false);
      }
    });
  }

  logout(): void {
    this.currentUser.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.rolKey);
      localStorage.removeItem(this.userKey);
    }
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem(this.tokenKey);
  }

  esAdmin(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    return localStorage.getItem(this.rolKey) === 'ADMIN';
  }
}
