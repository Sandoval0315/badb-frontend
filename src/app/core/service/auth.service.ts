import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { LoginRequest, LoginResponse } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private apiUrl = 'http://localhost:8080/api/auth';

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request);
  }

  guardarSesion(usuario: LoginResponse): void {
    if (isPlatformBrowser(this.platformId))
      localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  obtenerSesion(): LoginResponse | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    const data = localStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }

  esAdmin(): boolean { return this.obtenerSesion()?.rol === 'ADMIN'; }
  estaLogueado(): boolean { return this.obtenerSesion() !== null; }

  cerrarSesion(): void {
    if (isPlatformBrowser(this.platformId))
      localStorage.removeItem('usuario');
  }
}