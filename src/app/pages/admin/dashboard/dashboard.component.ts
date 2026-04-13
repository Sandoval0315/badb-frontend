import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../../core/service/producto.service';
import { Producto } from '../../../core/models/producto.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dash">
      <div class="dash-header">
        <div>
          <p class="eyebrow">Panel de administración</p>
          <h1 class="titulo">Dashboard</h1>
        </div>
        <button class="btn-nuevo" (click)="abrirFormulario()">+ Nuevo producto</button>
      </div>

      @if (mostrarFormulario) {
        <div class="form-card">
          <p class="form-titulo">{{ editando ? 'Editar producto' : 'Nuevo producto' }}</p>
          <div class="form-grid">
            <div class="field">
              <label>Nombre</label>
              <input type="text" [(ngModel)]="form.nombre" placeholder="Ej: El Apagón 001" />
            </div>
            <div class="field">
              <label>Precio</label>
              <input type="number" [(ngModel)]="form.precio" placeholder="0.00" />
            </div>
            <div class="field">
              <label>Stock</label>
              <input type="number" [(ngModel)]="form.stock" placeholder="0" />
            </div>
            <div class="field">
              <label>Categoría</label>
              <select [(ngModel)]="form.categoriaId">
                <option [value]="1">Sneakers</option>
                <option [value]="2">Slides</option>
                <option [value]="3">Botas</option>
              </select>
            </div>
            <div class="field">
              <label>Género</label>
              <select [(ngModel)]="form.genero" (ngModelChange)="onGeneroChange($event)">
                <option value="UNISEX">Unisex</option>
                <option value="HOMBRE">Hombre</option>
                <option value="MUJER">Mujer</option>
              </select>
            </div>
            <div class="field full">
              <label>URL de imagen</label>
              <input type="text" [(ngModel)]="form.imagenUrl" placeholder="https://..." />
            </div>
            <div class="field full">
              <label>Descripción</label>
              <textarea [(ngModel)]="form.descripcion" rows="3" placeholder="Descripción del producto..."></textarea>
            </div>
            <div class="field full">
              <label>Tallas disponibles</label>
              <div class="tallas-wrap">
                @for (talla of tallasDisponibles; track talla) {
                  <button type="button" class="talla-btn" [class.selected]="tallasSeleccionadas.includes(talla)" (click)="toggleTalla(talla)">{{ talla }}</button>
                }
              </div>
            </div>
            <div class="field full">
              <label>Colores disponibles</label>
              <div class="colores-wrap">
                @for (color of coloresDisponibles; track color.nombre) {
                  <button type="button" class="color-btn" [class.selected]="coloresSeleccionados.includes(color.nombre)" [style.background]="color.hex" [title]="color.nombre" (click)="toggleColor(color.nombre)">
                    @if (coloresSeleccionados.includes(color.nombre)) {
                      <span class="check" [style.color]="color.check">✓</span>
                    }
                  </button>
                }
              </div>
              <p class="colores-label">{{ coloresSeleccionados.length ? coloresSeleccionados.join(', ') : 'Ninguno seleccionado' }}</p>
            </div>
          </div>
          @if (error) { <p class="error">{{ error }}</p> }
          <div class="form-actions">
            <button class="btn-cancelar" (click)="cancelar()">Cancelar</button>
            <button class="btn-guardar" (click)="guardar()" [disabled]="guardando">
              {{ guardando ? 'Guardando...' : editando ? 'Actualizar' : 'Crear producto' }}
            </button>
          </div>
        </div>
      }

      <div class="stats">
        <div class="stat"><p class="stat-num">{{ productos.length }}</p><p class="stat-label">Productos</p></div>
        <div class="stat"><p class="stat-num">{{ totalStock }}</p><p class="stat-label">Unidades en stock</p></div>
        <div class="stat"><p class="stat-num">\${{ precioPromedio | number:'1.2-2' }}</p><p class="stat-label">Precio promedio</p></div>
      </div>

      @if (cargando) {
        <div class="loading"><div class="spinner"></div></div>
      } @else {
        <div class="tabla-wrap">
          <table class="tabla">
            <thead>
              <tr>
                <th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Tallas</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              @if (productos.length === 0) {
                <tr><td colspan="6" class="empty-row">No hay productos. Agrega el primero.</td></tr>
              }
              @for (p of productos; track p.id) {
                <tr class="tabla-row">
                  <td>
                    <div class="prod-cell">
                      <div class="prod-thumb">
                        @if (p.imagenUrl) { <img [src]="p.imagenUrl" [alt]="p.nombre" /> }
                        @else { <span>👟</span> }
                      </div>
                      <div>
                        <p class="prod-nombre">{{ p.nombre }}</p>
                        <p class="prod-genero">{{ p.genero }}</p>
                      </div>
                    </div>
                  </td>
                  <td><span class="cat-badge">{{ p.categoriaNombre }}</span></td>
                  <td><span class="precio-cell">\${{ p.precio | number:'1.2-2' }}</span></td>
                  <td><span class="stock-cell" [class.bajo]="p.stock < 5">{{ p.stock }}</span></td>
                  <td>
                    <div class="tallas-mini">
                      @for (t of (p.tallas || '').split(','); track t) {
                        @if (t) { <span class="talla-mini">{{ t }}</span> }
                      }
                    </div>
                  </td>
                  <td>
                    <div class="acciones">
                      <button class="btn-edit" (click)="editar(p)">Editar</button>
                      <button class="btn-delete" (click)="eliminar(p.id)">Eliminar</button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
  styles: [`
    .dash { max-width: 1200px; margin: 0 auto; padding: 3rem 2rem; }
    .dash-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2.5rem; }
    .eyebrow { font-family: var(--font-mono); font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--accent); margin-bottom: 0.4rem; }
    .titulo { font-size: 2rem; font-weight: 700; letter-spacing: -0.03em; color: var(--primary); }
    .btn-nuevo { font-family: var(--font-mono); font-size: 0.75rem; padding: 10px 20px; background: var(--primary); color: var(--base); border: none; border-radius: 999px; cursor: pointer; transition: opacity 0.2s; }
    .btn-nuevo:hover { opacity: 0.8; }
    .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2.5rem; }
    .stat { background: #fff; border: 0.5px solid var(--border); border-radius: 14px; padding: 1.25rem 1.5rem; }
    .stat-num { font-family: var(--font-mono); font-size: 1.75rem; font-weight: 700; color: var(--primary); margin-bottom: 4px; }
    .stat-label { font-size: 0.8rem; color: var(--muted); }
    .form-card { background: #fff; border: 0.5px solid var(--border); border-radius: 16px; padding: 1.75rem; margin-bottom: 2rem; }
    .form-titulo { font-size: 0.9rem; font-weight: 600; color: var(--primary); margin-bottom: 1.5rem; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem; }
    .field { display: flex; flex-direction: column; gap: 6px; }
    .field.full { grid-column: span 2; }
    label { font-family: var(--font-mono); font-size: 0.7rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
    input, textarea, select { padding: 0.7rem 1rem; border: 0.5px solid var(--border); border-radius: 10px; font-size: 0.9rem; background: var(--base); color: var(--primary); outline: none; font-family: var(--font-sans); transition: border-color 0.2s; }
    input:focus, textarea:focus, select:focus { border-color: var(--primary); }
    textarea { resize: vertical; }
    select { cursor: pointer; }
    .tallas-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
    .talla-btn { font-family: var(--font-mono); font-size: 0.75rem; padding: 6px 12px; border-radius: 8px; border: 0.5px solid var(--border); background: transparent; color: var(--muted); cursor: pointer; transition: all 0.15s; }
    .talla-btn:hover { border-color: var(--primary); color: var(--primary); }
    .talla-btn.selected { background: var(--primary); color: var(--base); border-color: var(--primary); }
    .colores-wrap { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 8px; }
    .color-btn { width: 32px; height: 32px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform 0.15s, border-color 0.15s; }
    .color-btn:hover { transform: scale(1.15); }
    .color-btn.selected { border-color: var(--primary); transform: scale(1.1); }
    .check { font-size: 14px; font-weight: 700; }
    .colores-label { font-family: var(--font-mono); font-size: 0.72rem; color: var(--muted); }
    .form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; }
    .btn-cancelar { padding: 0.7rem 1.5rem; background: transparent; border: 0.5px solid var(--border); border-radius: 999px; font-size: 0.875rem; color: var(--muted); cursor: pointer; transition: all 0.2s; }
    .btn-cancelar:hover { color: var(--primary); border-color: var(--primary); }
    .btn-guardar { padding: 0.7rem 1.5rem; background: var(--primary); color: var(--base); border: none; border-radius: 999px; font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: opacity 0.2s; }
    .btn-guardar:hover { opacity: 0.8; }
    .btn-guardar:disabled { opacity: 0.5; cursor: not-allowed; }
    .error { font-size: 0.85rem; color: #B91C1C; margin-bottom: 1rem; }
    .loading { display: flex; justify-content: center; padding: 4rem; }
    .spinner { width: 32px; height: 32px; border: 2px solid var(--border); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.7s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .tabla-wrap { background: #fff; border: 0.5px solid var(--border); border-radius: 16px; overflow: hidden; }
    .tabla { width: 100%; border-collapse: collapse; }
    .tabla thead tr { border-bottom: 0.5px solid var(--border); }
    .tabla th { font-family: var(--font-mono); font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); padding: 1rem 1.25rem; text-align: left; font-weight: 400; }
    .tabla-row { border-bottom: 0.5px solid var(--border); transition: background 0.15s; }
    .tabla-row:last-child { border-bottom: none; }
    .tabla-row:hover { background: var(--surface); }
    .tabla td { padding: 1rem 1.25rem; vertical-align: middle; }
    .prod-cell { display: flex; align-items: center; gap: 12px; }
    .prod-thumb { width: 44px; height: 44px; border-radius: 8px; background: var(--surface); overflow: hidden; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; border: 0.5px solid var(--border); }
    .prod-thumb img { width: 100%; height: 100%; object-fit: cover; }
    .prod-nombre { font-size: 0.9rem; font-weight: 600; color: var(--primary); }
    .prod-genero { font-family: var(--font-mono); font-size: 0.65rem; color: var(--muted); }
    .cat-badge { font-family: var(--font-mono); font-size: 0.65rem; padding: 4px 10px; background: var(--surface); color: var(--muted); border-radius: 999px; border: 0.5px solid var(--border); }
    .precio-cell { font-family: var(--font-mono); font-size: 0.875rem; font-weight: 700; color: var(--primary); }
    .stock-cell { font-family: var(--font-mono); font-size: 0.875rem; color: var(--primary); }
    .stock-cell.bajo { color: #B91C1C; }
    .tallas-mini { display: flex; flex-wrap: wrap; gap: 4px; }
    .talla-mini { font-family: var(--font-mono); font-size: 0.6rem; padding: 2px 6px; background: var(--surface); border-radius: 4px; color: var(--muted); }
    .acciones { display: flex; gap: 8px; }
    .btn-edit { font-family: var(--font-mono); font-size: 0.7rem; padding: 5px 12px; background: transparent; border: 0.5px solid var(--border); border-radius: 999px; color: var(--muted); cursor: pointer; transition: all 0.2s; }
    .btn-edit:hover { color: var(--primary); border-color: var(--primary); }
    .btn-delete { font-family: var(--font-mono); font-size: 0.7rem; padding: 5px 12px; background: transparent; border: 0.5px solid #FECACA; border-radius: 999px; color: #B91C1C; cursor: pointer; transition: all 0.2s; }
    .btn-delete:hover { background: #FEF2F2; }
    .empty-row { text-align: center; color: var(--muted); font-size: 0.875rem; padding: 3rem; }
  `]
})
export class DashboardComponent implements OnInit {
  productos: Producto[] = [];
  cargando = true;
  mostrarFormulario = false;
  editando = false;
  guardando = false;
  error = '';
  productoEditandoId: number | null = null;
  tallasSeleccionadas: string[] = [];
  coloresSeleccionados: string[] = [];

  tallasHombre = ['38','39','40','41','42','43','44','45'];
  tallasMujer = ['35','36','37','38','39','40','41'];
  tallasUnisex = ['35','36','37','38','39','40','41','42','43','44','45'];
  tallasDisponibles = this.tallasUnisex;

  coloresDisponibles = [
    { nombre: 'Negro', hex: '#1A1A18', check: '#fff' },
    { nombre: 'Blanco', hex: '#FFFFFF', check: '#1A1A18' },
    { nombre: 'Gris', hex: '#888780', check: '#fff' },
    { nombre: 'Beige', hex: '#C8A97E', check: '#fff' },
    { nombre: 'Rojo', hex: '#DC2626', check: '#fff' },
    { nombre: 'Azul', hex: '#2563EB', check: '#fff' },
    { nombre: 'Verde', hex: '#16A34A', check: '#fff' },
    { nombre: 'Amarillo', hex: '#EAB308', check: '#1A1A18' },
    { nombre: 'Rosa', hex: '#EC4899', check: '#fff' },
    { nombre: 'Naranja', hex: '#EA580C', check: '#fff' },
  ];

  form = {
    nombre: '', descripcion: '', precio: 0, stock: 0,
    imagenUrl: '', categoriaId: 1, genero: 'UNISEX', tallas: '', colores: ''
  };

  constructor(
    private productoService: ProductoService,
    private cdr: ChangeDetectorRef
  ) {}

  get totalStock() { return this.productos.reduce((a, p) => a + p.stock, 0); }
  get precioPromedio() {
    if (!this.productos.length) return 0;
    return this.productos.reduce((a, p) => a + Number(p.precio), 0) / this.productos.length;
  }

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.cargando = true;
    this.productoService.listar().subscribe({
      next: (data) => { 
        this.productos = data; 
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => { 
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  onGeneroChange(genero: string) {
    this.tallasSeleccionadas = [];
    if (genero === 'HOMBRE') this.tallasDisponibles = this.tallasHombre;
    else if (genero === 'MUJER') this.tallasDisponibles = this.tallasMujer;
    else this.tallasDisponibles = this.tallasUnisex;
  }

  toggleTalla(talla: string) {
    this.tallasSeleccionadas = this.tallasSeleccionadas.includes(talla)
      ? this.tallasSeleccionadas.filter(t => t !== talla)
      : [...this.tallasSeleccionadas, talla];
  }

  toggleColor(color: string) {
    this.coloresSeleccionados = this.coloresSeleccionados.includes(color)
      ? this.coloresSeleccionados.filter(c => c !== color)
      : [...this.coloresSeleccionados, color];
  }

  abrirFormulario() {
    this.editando = false;
    this.productoEditandoId = null;
    this.tallasSeleccionadas = [];
    this.coloresSeleccionados = [];
    this.tallasDisponibles = this.tallasUnisex;
    this.form = { nombre: '', descripcion: '', precio: 0, stock: 0, imagenUrl: '', categoriaId: 1, genero: 'UNISEX', tallas: '', colores: '' };
    this.mostrarFormulario = true;
    this.error = '';
    this.cdr.detectChanges();
  }

  editar(p: Producto) {
    this.editando = true;
    this.productoEditandoId = p.id;
    this.tallasSeleccionadas = p.tallas ? p.tallas.split(',').filter(Boolean) : [];
    this.coloresSeleccionados = p.colores ? p.colores.split(',').filter(Boolean) : [];
    this.onGeneroChange(p.genero || 'UNISEX');
    this.form = {
      nombre: p.nombre, descripcion: p.descripcion || '',
      precio: Number(p.precio), stock: p.stock,
      imagenUrl: p.imagenUrl || '', categoriaId: p.categoriaId,
      genero: p.genero || 'UNISEX', tallas: p.tallas || '', colores: p.colores || ''
    };
    this.mostrarFormulario = true;
    this.error = '';
    this.cdr.detectChanges();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelar() { 
    this.mostrarFormulario = false; 
    this.error = '';
    this.cdr.detectChanges();
  }

  guardar() {
    if (!this.form.nombre || !this.form.precio) {
      this.error = 'Nombre y precio son obligatorios.';
      this.cdr.detectChanges();
      return;
    }
    this.guardando = true;
    this.error = '';

    const payload = {
      ...this.form,
      categoriaId: Number(this.form.categoriaId),
      precio: Number(this.form.precio),
      stock: Number(this.form.stock),
      tallas: this.tallasSeleccionadas.join(','),
      colores: this.coloresSeleccionados.join(',')
    } as unknown as Producto;

    const accion = this.editando && this.productoEditandoId
      ? this.productoService.actualizar(this.productoEditandoId, payload)
      : this.productoService.crear(payload);

    accion.subscribe({
      next: () => {
        this.guardando = false;
        this.mostrarFormulario = false;
        this.editando = false;
        this.productoEditandoId = null;
        this.tallasSeleccionadas = [];
        this.coloresSeleccionados = [];
        this.cargarProductos();
        this.cdr.detectChanges();
      },
      error: () => { 
        this.error = 'Ocurrió un error. Intenta de nuevo.'; 
        this.guardando = false;
        this.cdr.detectChanges();
      }
    });
  }

  eliminar(id: number) {
    if (!confirm('¿Eliminar este producto?')) return;
    this.productoService.eliminar(id).subscribe({
      next: () => { 
        this.productos = this.productos.filter(p => p.id !== id);
        this.cdr.detectChanges();
      }
    });
  }
}