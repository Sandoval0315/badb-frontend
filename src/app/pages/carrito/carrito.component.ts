import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarritoService } from '../../core/service/carrito.service';
import { AuthService } from '../../core/service/auth.service';
import { CarritoItem } from '../../core/models/carrito.model';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="carrito-wrap fade-in">
      <div class="carrito-header fade-in-up">
        <p class="eyebrow">Tu selección</p>
        <h1 class="titulo">Carrito</h1>
      </div>

      @if (cargando) {
        <div class="loading"><div class="spinner"></div></div>
      }

      @if (!cargando && items.length === 0) {
        <div class="empty fade-in-up">
          <p class="empty-icon">🛒</p>
          <p class="empty-text">Tu carrito está vacío</p>
          <a routerLink="/home" class="btn-volver">Ver productos</a>
        </div>
      }

      @if (!cargando && items.length > 0) {
        <div class="carrito-grid">
          <div class="items stagger">
            @for (item of items; track item.id) {
              <div class="item fade-in-up">
                <div class="item-img">
                  @if (item.imagenUrl) {
                    <img [src]="item.imagenUrl" [alt]="item.productoNombre" />
                  } @else {
                    <span>👟</span>
                  }
                </div>
                <div class="item-info">
                  <p class="item-nombre">{{ item.productoNombre }}</p>
                  <p class="item-precio">\${{ item.precio | number:'1.2-2' }} × {{ item.cantidad }}</p>
                </div>
                <div class="item-right">
                  <p class="item-subtotal">\${{ item.subtotal | number:'1.2-2' }}</p>
                  <button class="btn-eliminar" (click)="eliminar(item.id)">✕</button>
                </div>
              </div>
            }
          </div>

          <div class="resumen fade-in-up">
            <p class="resumen-label">Resumen</p>
            <div class="resumen-row">
              <span>Subtotal</span>
              <span>\${{ total | number:'1.2-2' }}</span>
            </div>
            <div class="resumen-row">
              <span>Envío</span>
              <span class="gratis">Gratis</span>
            </div>
            <div class="resumen-total">
              <span>Total</span>
              <span>\${{ total | number:'1.2-2' }}</span>
            </div>
            <button class="btn-checkout">Proceder al pago</button>
            <button class="btn-vaciar" (click)="vaciar()">Vaciar carrito</button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .carrito-wrap {
      max-width: 1100px;
      margin: 0 auto;
      padding: 3rem 2rem;
    }
    .eyebrow {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 0.5rem;
    }
    .titulo {
      font-size: 2rem;
      font-weight: 700;
      letter-spacing: -0.03em;
      margin-bottom: 2.5rem;
    }
    .loading {
      display: flex;
      justify-content: center;
      padding: 4rem;
    }
    .spinner {
      width: 32px;
      height: 32px;
      border: 2px solid var(--border);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .empty {
      text-align: center;
      padding: 5rem 2rem;
    }
    .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
    .empty-text {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      color: var(--primary);
    }
    .btn-volver {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      letter-spacing: 0.08em;
      padding: 10px 24px;
      background: var(--primary);
      color: var(--base);
      border-radius: 999px;
    }
    .carrito-grid {
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 3rem;
      align-items: start;
    }
    @media (max-width: 768px) {
      .carrito-grid { grid-template-columns: 1fr; }
    }
    .item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem 0;
      border-bottom: 0.5px solid var(--border);
      opacity: 0;
    }
    .item-img {
      width: 72px;
      height: 72px;
      border-radius: 12px;
      background: var(--surface);
      overflow: hidden;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      border: 0.5px solid var(--border);
    }
    .item-img img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .item-info { flex: 1; }
    .item-nombre {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--primary);
      margin-bottom: 4px;
    }
    .item-precio {
      font-family: var(--font-mono);
      font-size: 0.78rem;
      color: var(--muted);
    }
    .item-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 8px;
    }
    .item-subtotal {
      font-family: var(--font-mono);
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--primary);
    }
    .btn-eliminar {
      background: transparent;
      border: none;
      color: var(--muted);
      font-size: 0.75rem;
      transition: color 0.2s;
    }
    .btn-eliminar:hover { color: #B91C1C; }
    .resumen {
      background: #fff;
      border: 0.5px solid var(--border);
      border-radius: 16px;
      padding: 1.5rem;
      position: sticky;
      top: 100px;
    }
    .resumen-label {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 1.25rem;
    }
    .resumen-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
      color: var(--muted);
      margin-bottom: 0.75rem;
    }
    .gratis {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: #15803D;
    }
    .resumen-total {
      display: flex;
      justify-content: space-between;
      font-size: 1rem;
      font-weight: 700;
      color: var(--primary);
      padding-top: 1rem;
      border-top: 0.5px solid var(--border);
      margin-bottom: 1.5rem;
    }
    .btn-checkout {
      width: 100%;
      padding: 0.875rem;
      background: var(--primary);
      color: var(--base);
      border: none;
      border-radius: 999px;
      font-size: 0.95rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
      transition: opacity 0.2s;
    }
    .btn-checkout:hover { opacity: 0.8; }
    .btn-vaciar {
      width: 100%;
      padding: 0.75rem;
      background: transparent;
      color: var(--muted);
      border: 0.5px solid var(--border);
      border-radius: 999px;
      font-size: 0.85rem;
      transition: all 0.2s;
    }
    .btn-vaciar:hover { color: #B91C1C; border-color: #FECACA; }
  `]
})
export class CarritoComponent implements OnInit {
  items: CarritoItem[] = [];
  cargando = true;

  constructor(
    private carritoService: CarritoService,
    private authService: AuthService
  ) {}

  get total(): number {
    return this.items.reduce((acc, item) => acc + item.subtotal, 0);
  }

  ngOnInit(): void {
    const usuario = this.authService.obtenerSesion();
    if (!usuario) return;
    this.carritoService.obtener(usuario.id).subscribe({
      next: (data) => { this.items = data; this.cargando = false; },
      error: () => { this.cargando = false; }
    });
  }

  eliminar(id: number): void {
    this.carritoService.eliminarItem(id).subscribe({
      next: () => { this.items = this.items.filter(i => i.id !== id); }
    });
  }

  vaciar(): void {
    const usuario = this.authService.obtenerSesion();
    if (!usuario) return;
    this.carritoService.vaciar(usuario.id).subscribe({
      next: () => { this.items = []; }
    });
  }
}