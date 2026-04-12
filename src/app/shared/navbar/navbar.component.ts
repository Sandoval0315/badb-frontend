import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="navbar fade-in">
      <a routerLink="/home" class="logo">BADBOSHOP</a>
      <div class="nav-links">
        <a routerLink="/home" class="nav-link">Tienda</a>
        @if (estaLogueado()) {
          <a routerLink="/carrito" class="nav-link carrito">
            <span class="carrito-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            </span>
            Carrito
          </a>
          @if (esAdmin()) {
            <a routerLink="/admin/dashboard" class="nav-link admin">Dashboard</a>
          }
          <button (click)="cerrarSesion()" class="btn-logout">Salir</button>
        } @else {
          <a routerLink="/login" class="btn-login">Iniciar sesión</a>
        }
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 2.5rem;
      background: var(--base);
      border-bottom: 0.5px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .logo {
      font-family: var(--font-mono);
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: 0.15em;
      color: var(--primary);
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 2rem;
    }
    .nav-link {
      font-size: 0.875rem;
      color: var(--muted);
      transition: color 0.2s;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .nav-link:hover { color: var(--primary); }
    .admin {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      letter-spacing: 0.08em;
      color: var(--accent) !important;
    }
    .btn-login {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--base);
      background: var(--primary);
      padding: 0.5rem 1.25rem;
      border-radius: 999px;
      transition: opacity 0.2s;
    }
    .btn-login:hover { opacity: 0.8; }
    .btn-logout {
      font-size: 0.875rem;
      color: var(--muted);
      background: transparent;
      border: 0.5px solid var(--border);
      padding: 0.5rem 1.25rem;
      border-radius: 999px;
      transition: all 0.2s;
    }
    .btn-logout:hover { color: var(--primary); border-color: var(--primary); }
  `]
})
export class NavbarComponent {
  constructor(private authService: AuthService, private router: Router) {}
  estaLogueado() { return this.authService.estaLogueado(); }
  esAdmin() { return this.authService.esAdmin(); }
  cerrarSesion() {
    this.authService.cerrarSesion();
    this.router.navigate(['/home']);
  }
}