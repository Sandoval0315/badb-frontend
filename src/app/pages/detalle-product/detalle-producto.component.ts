import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../../core/service/producto.service';
import { CarritoService } from '../../core/service/carrito.service';
import { AuthService } from '../../core/service/auth.service';
import { Producto } from '../../core/models/producto.model';

@Component({
  selector: 'app-detalle-producto',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (cargando) {
      <div class="loading fade-in">
        <div class="spinner"></div>
      </div>
    }

    @if (!cargando && producto) {
      <div class="detalle fade-in">
        <button class="btn-back" (click)="volver()">
          ← Volver
        </button>

        <div class="detalle-grid">
          <div class="img-wrap fade-in-up">
            @if (producto.imagenUrl) {
              <img [src]="producto.imagenUrl" [alt]="producto.nombre" class="img" />
            } @else {
              <div class="img-placeholder"><span>👟</span></div>
            }
          </div>

          <div class="info fade-in-up">
            <p class="eyebrow">{{ producto.categoriaNombre }}</p>
            <h1 class="nombre">{{ producto.nombre }}</h1>
            <p class="precio">\${{ producto.precio | number:'1.2-2' }}</p>
            <p class="descripcion">{{ producto.descripcion }}</p>

            <div class="stock-row">
              <span class="stock-badge" [class.agotado]="producto.stock === 0">
                {{ producto.stock > 0 ? producto.stock + ' disponibles' : 'Agotado' }}
              </span>
            </div>

            <div class="cantidad-row">
              <button class="qty-btn" (click)="cambiarCantidad(-1)" [disabled]="cantidad <= 1">−</button>
              <span class="cantidad">{{ cantidad }}</span>
              <button class="qty-btn" (click)="cambiarCantidad(1)" [disabled]="cantidad >= producto.stock">+</button>
            </div>

            <button
              class="btn-agregar"
              (click)="agregarAlCarrito()"
              [disabled]="producto.stock === 0 || agregado">
              {{ agregado ? '✓ Agregado al carrito' : 'Agregar al carrito' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .loading {
      display: flex;
      justify-content: center;
      padding: 6rem;
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
    .detalle {
      max-width: 1100px;
      margin: 0 auto;
      padding: 2rem;
    }
    .btn-back {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      letter-spacing: 0.08em;
      color: var(--muted);
      background: transparent;
      border: none;
      padding: 0;
      margin-bottom: 2.5rem;
      transition: color 0.2s;
    }
    .btn-back:hover { color: var(--primary); }
    .detalle-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: start;
    }
    @media (max-width: 768px) {
      .detalle-grid { grid-template-columns: 1fr; gap: 2rem; }
    }
    .img-wrap {
      aspect-ratio: 1;
      background: var(--surface);
      border-radius: 20px;
      overflow: hidden;
      border: 0.5px solid var(--border);
    }
    .img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .img-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 6rem;
    }
    .eyebrow {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 0.75rem;
    }
    .nombre {
      font-size: 2rem;
      font-weight: 700;
      letter-spacing: -0.03em;
      line-height: 1.1;
      margin-bottom: 1rem;
      color: var(--primary);
    }
    .precio {
      font-family: var(--font-mono);
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--primary);
      margin-bottom: 1.5rem;
    }
    .descripcion {
      font-size: 0.95rem;
      color: var(--muted);
      line-height: 1.7;
      margin-bottom: 1.5rem;
    }
    .stock-row { margin-bottom: 1.5rem; }
    .stock-badge {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      letter-spacing: 0.08em;
      padding: 5px 12px;
      border-radius: 999px;
      background: var(--surface);
      color: var(--primary);
      border: 0.5px solid var(--border);
    }
    .stock-badge.agotado {
      background: #FEF2F2;
      color: #B91C1C;
      border-color: #FECACA;
    }
    .cantidad-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .qty-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 0.5px solid var(--border);
      background: transparent;
      font-size: 1.2rem;
      color: var(--primary);
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .qty-btn:hover:not(:disabled) {
      background: var(--primary);
      color: var(--base);
      border-color: var(--primary);
    }
    .qty-btn:disabled { opacity: 0.3; cursor: not-allowed; }
    .cantidad {
      font-family: var(--font-mono);
      font-size: 1.1rem;
      font-weight: 700;
      min-width: 24px;
      text-align: center;
    }
    .btn-agregar {
      width: 100%;
      padding: 1rem;
      background: var(--primary);
      color: var(--base);
      border: none;
      border-radius: 999px;
      font-size: 0.95rem;
      font-weight: 600;
      transition: opacity 0.2s;
    }
    .btn-agregar:hover:not(:disabled) { opacity: 0.8; }
    .btn-agregar:disabled { opacity: 0.5; cursor: not-allowed; }
  `]
})
export class DetalleProductoComponent implements OnInit {
  producto: Producto | null = null;
  cargando = true;
  cantidad = 1;
  agregado = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productoService: ProductoService,
    private carritoService: CarritoService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productoService.obtener(id).subscribe({
      next: (data) => { 
        this.producto = data; 
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => { 
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  volver(): void { 
    this.router.navigate(['/home']); 
  }

  cambiarCantidad(delta: number): void {
    this.cantidad = Math.max(1, Math.min(this.cantidad + delta, this.producto?.stock ?? 1));
    this.cdr.detectChanges();
  }

  agregarAlCarrito(): void {
    const usuario = this.authService.obtenerSesion();
    if (!usuario) { 
      this.router.navigate(['/login']); 
      return; 
    }
    this.carritoService.agregar(usuario.id, this.producto!.id, this.cantidad).subscribe({
      next: () => {
        this.agregado = true;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.agregado = false;
          this.cdr.detectChanges();
        }, 2500);
      }
    });
  }
}