import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CarritoItem } from '../models/carrito.model';

@Injectable({ providedIn: 'root' })
export class CarritoService {

  private apiUrl = 'http://localhost:8080/api/carrito';

  constructor(private http: HttpClient) {}

  obtener(usuarioId: number): Observable<CarritoItem[]> {
    return this.http.get<CarritoItem[]>(`${this.apiUrl}/${usuarioId}`);
  }

  agregar(usuarioId: number, productoId: number, cantidad: number): Observable<CarritoItem> {
    return this.http.post<CarritoItem>(
      `${this.apiUrl}/${usuarioId}/agregar`,
      null,
      { params: { productoId, cantidad } }
    );
  }

  eliminarItem(carritoId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/item/${carritoId}`);
  }

  vaciar(usuarioId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${usuarioId}/vaciar`);
  }
}