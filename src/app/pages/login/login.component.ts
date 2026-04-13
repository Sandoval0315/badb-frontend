import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-wrap fade-in">
      <div class="login-card fade-in-up">
        <p class="eyebrow">Bienvenido</p>
        <h1 class="title">BADBOSHOP</h1>
        <p class="subtitle">Inicia sesión para continuar</p>

        @if (error) {
          <div class="error fade-in">{{ error }}</div>
        }

        <div class="field">
          <label>Email</label>
          <input type="email" [(ngModel)]="email" placeholder="tucorreo@ejemplo.com" />
        </div>

        <div class="field">
          <label>Contraseña</label>
          <input type="password" [(ngModel)]="password" placeholder="••••••••" />
        </div>

        <button class="btn-submit" (click)="login()" [disabled]="cargando">
          {{ cargando ? 'Ingresando...' : 'Iniciar sesión' }}
        </button>

        <div class="hints">
          <span>admin&#64;badboshop.com / admin123</span>
          <span>cliente&#64;badboshop.com / cliente123</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-wrap {
      min-height: calc(100vh - 64px);
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--base);
      padding: 2rem;
    }
    .login-card {
      width: 100%;
      max-width: 420px;
      background: #fff;
      border: 0.5px solid var(--border);
      border-radius: 20px;
      padding: 2.5rem;
    }
    .eyebrow {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 0.5rem;
    }
    .title {
      font-family: var(--font-mono);
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: var(--primary);
      margin-bottom: 0.4rem;
    }
    .subtitle {
      font-size: 0.9rem;
      color: var(--muted);
      margin-bottom: 2rem;
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 1rem;
    }
    label {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--muted);
    }
    input {
      padding: 0.75rem 1rem;
      border: 0.5px solid var(--border);
      border-radius: 10px;
      font-size: 0.95rem;
      background: var(--base);
      color: var(--primary);
      outline: none;
      transition: border-color 0.2s;
    }
    input:focus { border-color: var(--primary); }
    .btn-submit {
      width: 100%;
      padding: 0.875rem;
      background: var(--primary);
      color: var(--base);
      border: none;
      border-radius: 999px;
      font-size: 0.95rem;
      font-weight: 600;
      margin-top: 0.5rem;
      transition: opacity 0.2s;
      cursor: pointer;
    }
    .btn-submit:hover { opacity: 0.85; }
    .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
    .error {
      background: #FEF2F2;
      color: #B91C1C;
      padding: 0.75rem 1rem;
      border-radius: 10px;
      font-size: 0.85rem;
      margin-bottom: 1rem;
    }
    .hints {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-top: 1.5rem;
      padding-top: 1.25rem;
      border-top: 0.5px solid var(--border);
    }
    .hints span {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: var(--muted);
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  cargando = false;

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.error = '';
    this.cargando = true;
    this.authService.login({ email: this.email, password: this.password })
      .subscribe({
        next: (usuario) => {
          this.authService.guardarSesion(usuario);
          this.router.navigate([usuario.rol === 'ADMIN' ? '/admin/dashboard' : '/home']);
        },
        error: () => {
          this.error = 'Credenciales incorrectas. Intenta de nuevo.';
          this.cargando = false;
        }
      });
  }
}