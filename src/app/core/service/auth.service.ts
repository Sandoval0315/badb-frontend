import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request);
  }

  guardarSesion(usuario: LoginResponse): void {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  obtenerSesion(): LoginResponse | null {
    const data = localStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }

  esAdmin(): boolean {
    return this.obtenerSesion()?.rol === 'ADMIN';
  }

  estaLogueado(): boolean {
    return this.obtenerSesion() !== null;
  }

  cerrarSesion(): void {
    localStorage.removeItem('usuario');
  }
}