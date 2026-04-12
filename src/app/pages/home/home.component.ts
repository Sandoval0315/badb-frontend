import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductoService } from '../../core/service/producto.service';
import { CarritoService } from '../../core/service/carrito.service';
import { AuthService } from '../../core/service/auth.service';
import { Producto } from '../../core/models/producto.model';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <section class="hero fade-in">
      <div class="hero-inner">
        <p class="hero-eyebrow">Colección exclusiva</p>
        <h1 class="hero-title">BAD BUNNY<br>FOOTWEAR</h1>
        <p class="hero-sub">Diseños únicos. Edición limitada.</p>
      </div>
    </section>

    <section class="productos-section">
      <div class="section-header fade-in-up">
        <p class="section-label">Catálogo</p>
        <div class="filtros">
          <button
            class="filtro-btn"
            [class.active]="categoriaActiva === null"
            (click)="filtrar(null)">
            Todos
          </button>
          @for (cat of categorias; track cat) {
            <button
              class="filtro-btn"
              [class.active]="categoriaActiva === cat"
              (click)="filtrar(cat)">
              {{ cat }}
            </button>
          }
        </div>
      </div>

      @if (cargando) {
        <div class="loading fade-in">
          <div class="spinner"></div>
        </div>
      }

      @if (!cargando && productosFiltrados.length === 0) {
        <div class="empty fade-in-up">
          <p class="empty-icon">👟</p>
          <p class="empty-text">No hay productos todavía</p>
          <p class="empty-sub">El admin puede agregar productos desde el dashboard</p>
        </div>
      }

      <div class="grid stagger">
        @for (producto of productosFiltrados; track producto.id) {
          <div class="card fade-in-up">
            <a [routerLink]="['/producto', producto.id]" class="card-img-wrap">
              @if (producto.imagenUrl) {
                <img [src]="producto.imagenUrl" [alt]="producto.nombre" class="card-img" />
              } @else {
                <div class="card-img-placeholder">
                  <span>👟</span>
                </div>
              }
              <span class="card-badge">{{ producto.categoriaNombre }}</span>
            </a>
            <div class="card-body">
              <a [routerLink]="['/producto', producto.id]" class="card-name">
                {{ producto.nombre }}
              </a>
<p class="card-desc">{{ (producto.descripcion || '') | slice:0:60 }}{{ (producto.descripcion?.length ?? 0) > 60 ? '...' : '' }}</p>
              <div class="card-footer">
                <span class="card-price">\${{ producto.precio | number:'1.2-2' }}</span>
                <button class="btn-carrito" (click)="agregarAlCarrito(producto)">
                  {{ agregado === producto.id ? '✓ Agregado' : '+ Carrito' }}
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    </section>
  `,
    styles: [`
    .hero {
      background: var(--primary);
      color: var(--base);
      padding: 5rem 2.5rem;
      text-align: center;
    }
    .hero-eyebrow {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 1rem;
    }
    .hero-title {
      font-family: var(--font-mono);
      font-size: clamp(2.5rem, 8vw, 5rem);
      font-weight: 700;
      letter-spacing: -0.02em;
      line-height: 1;
      margin-bottom: 1rem;
    }
    .hero-sub {
      font-size: 1rem;
      color: #888780;
      letter-spacing: 0.05em;
    }
    .productos-section {
      max-width: 1200px;
      margin: 0 auto;
      padding: 3rem 2rem;
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .section-label {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--muted);
    }
    .filtros {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .filtro-btn {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 6px 14px;
      border-radius: 999px;
      border: 0.5px solid var(--border);
      background: transparent;
      color: var(--muted);
      transition: all 0.2s;
    }
    .filtro-btn:hover { color: var(--primary); border-color: var(--primary); }
    .filtro-btn.active {
      background: var(--primary);
      color: var(--base);
      border-color: var(--primary);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 1.5rem;
    }
    .card {
      background: #fff;
      border: 0.5px solid var(--border);
      border-radius: 16px;
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
      opacity: 0;
    }
    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0,0,0,0.08);
    }
    .card-img-wrap {
      display: block;
      position: relative;
      aspect-ratio: 1;
      overflow: hidden;
      background: var(--surface);
    }
    .card-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }
    .card-img-wrap:hover .card-img { transform: scale(1.04); }
    .card-img-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 4rem;
      background: var(--surface);
    }
    .card-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      background: var(--base);
      color: var(--primary);
      font-family: var(--font-mono);
      font-size: 0.65rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 4px 10px;
      border-radius: 999px;
      border: 0.5px solid var(--border);
    }
    .card-body { padding: 1rem 1.25rem 1.25rem; }
    .card-name {
      display: block;
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--primary);
      margin-bottom: 4px;
      transition: color 0.2s;
    }
    .card-name:hover { color: var(--accent); }
    .card-desc {
      font-size: 0.8rem;
      color: var(--muted);
      margin-bottom: 1rem;
      line-height: 1.5;
    }
    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .card-price {
      font-family: var(--font-mono);
      font-size: 1rem;
      font-weight: 700;
      color: var(--primary);
    }
    .btn-carrito {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      letter-spacing: 0.05em;
      padding: 7px 14px;
      background: var(--primary);
      color: var(--base);
      border: none;
      border-radius: 999px;
      transition: opacity 0.2s;
    }
    .btn-carrito:hover { opacity: 0.8; }
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
      color: var(--primary);
      margin-bottom: 0.5rem;
    }
    .empty-sub { font-size: 0.85rem; color: var(--muted); }
  `]
})
export class HomeComponent implements OnInit {
    productos: Producto[] = [];
    productosFiltrados: Producto[] = [];
    categorias: string[] = [];
    categoriaActiva: string | null = null;
    cargando = true;
    agregado: number | null = null;

    constructor(
        private productoService: ProductoService,
        private carritoService: CarritoService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.productoService.listar().subscribe({
            next: (data) => {
                this.productos = data;
                this.productosFiltrados = data;
                this.categorias = [...new Set(data.map(p => p.categoriaNombre).filter(Boolean))];
                this.cargando = false;
            },
            error: () => { this.cargando = false; }
        });
    }

    filtrar(categoria: string | null): void {
        this.categoriaActiva = categoria;
        this.productosFiltrados = categoria
            ? this.productos.filter(p => p.categoriaNombre === categoria)
            : this.productos;
    }

    agregarAlCarrito(producto: Producto): void {
        const usuario = this.authService.obtenerSesion();
        if (!usuario) {
            window.location.href = '/login';
            return;
        }
        this.carritoService.agregar(usuario.id, producto.id, 1).subscribe({
            next: () => {
                this.agregado = producto.id;
                setTimeout(() => this.agregado = null, 2000);
            }
        });
    }
}