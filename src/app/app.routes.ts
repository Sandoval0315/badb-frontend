import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component')
      .then(m => m.HomeComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component')
      .then(m => m.HomeComponent)
  },
  {
    path: 'producto/:id',
    loadComponent: () => import('./pages/detalle-product/detalle-producto.component')
      .then(m => m.DetalleProductoComponent)
  },
  {
    path: 'carrito',
    loadComponent: () => import('./pages/carrito/carrito.component')
      .then(m => m.CarritoComponent),
    canActivate: [authGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component')
      .then(m => m.LoginComponent)
  },
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./pages/admin/dashboard/dashboard.component')
      .then(m => m.DashboardComponent),
    canActivate: [authGuard, adminGuard]
  },
  { path: '**', redirectTo: '' }
];