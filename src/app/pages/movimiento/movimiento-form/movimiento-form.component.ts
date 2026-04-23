import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MovimientoService } from '../../../services/movimiento.service';
import { Movimiento, MovimientoCreateDto, MovimientoUpdateDto, Page } from '../../../models/movimiento.model';

@Component({
  selector: 'app-movimiento-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <header class="header">
      <div class="header-logo">
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="12" height="12" rx="2" stroke="#fff" stroke-width="1.5"/>
          <path d="M5 8h6M5 5.5h4M5 10.5h3" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
      </div>
      <span class="header-title">Tracker Movimientos</span>
    </header>

    <main class="main">
      <h1 class="page-title">{{ isEditMode ? 'Editar' : 'Nuevo' }} movimiento</h1>

      <form class="form" (ngSubmit)="onSubmit()">
        <div class="form-row">
          <div class="form-group">
            <label for="fecha">Fecha</label>
            <input
              type="date"
              id="fecha"
              [(ngModel)]="form.fecha"
              name="fecha"
              required
            />
          </div>

          <div class="form-group">
            <label for="tipoPrenda">Tipo de prenda</label>
            <select
              id="tipoPrenda"
              [(ngModel)]="form.tipoPrenda"
              name="tipoPrenda"
              required
            >
              <option value="">Seleccionar...</option>
              <option value="Remera">Remera</option>
              <option value="Pantalón">Pantalón</option>
              <option value="Campera">Campera</option>
              <option value="Calzado">Calzado</option>
              <option value="Accesorio">Accesorio</option>
            </select>
          </div>
        </div>

        <div class="form-group full">
          <label for="descripcion">Descripción</label>
          <input
            type="text"
            id="descripcion"
            [(ngModel)]="form.descripcion"
            name="descripcion"
            placeholder="Ingrese descripción del movimiento"
            required
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="monto">Monto</label>
            <input
              type="number"
              id="monto"
              [(ngModel)]="form.monto"
              name="monto"
              step="0.01"
              min="0"
              placeholder="0.00"
              required
            />
          </div>

          <div class="form-group">
            <label for="movimiento">Tipo de movimiento</label>
            <select
              id="movimiento"
              [(ngModel)]="form.movimiento"
              name="movimiento"
              required
            >
              <option value="">Seleccionar...</option>
              <option value="Venta">Venta</option>
              <option value="Compra">Compra</option>
              <option value="Devolución">Devolución</option>
            </select>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-cancel" (click)="cancel()">Cancelar</button>
          <button type="submit" class="btn-save">{{ isEditMode ? 'Actualizar' : 'Guardar' }}</button>
        </div>
      </form>
    </main>
  `,
  styles: [`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :host {
      --bg-primary: #ffffff;
      --bg-secondary: #f7f6f3;
      --bg-tertiary: #f1efe8;
      --text-primary: #1a1a1a;
      --text-secondary: #5f5e5a;
      --text-tertiary: #888780;
      --border-light: rgba(0,0,0,0.08);
      --border-mid: rgba(0,0,0,0.14);
      --border-strong: rgba(0,0,0,0.22);
      --radius-md: 8px;
      --radius-lg: 12px;
      --header-bg: #1a1a2e;
      --accent: #2563eb;
      --accent-hover: #1d4ed8;
      --font-sans: 'DM Sans', sans-serif;
      --font-mono: 'DM Mono', monospace;
    }

    .header {
      background: var(--header-bg);
      padding: 14px 28px;
      display: flex;
      align-items: center;
      gap: 12px;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .header-logo {
      width: 30px; height: 30px;
      background: linear-gradient(135deg, #e8a87c, #c97b4b);
      border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }

    .header-logo svg { width: 16px; height: 16px; }

    .header-title {
      color: #f0ede8;
      font-size: 15px;
      font-weight: 500;
      letter-spacing: 0.01em;
    }

    .main {
      max-width: 600px;
      margin: 0 auto;
      padding: 36px 28px 60px;
    }

    .page-title {
      font-size: 28px;
      font-weight: 600;
      color: var(--text-primary);
      letter-spacing: -0.025em;
      margin-bottom: 24px;
    }

    .form {
      background: var(--bg-primary);
      border: 0.5px solid var(--border-light);
      border-radius: var(--radius-lg);
      padding: 24px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.05);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 16px;
    }

    .form-group.full {
      grid-column: 1 / -1;
    }

    .form-group label {
      font-size: 12px;
      font-weight: 500;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .form-group input,
    .form-group select {
      padding: 10px 12px;
      border: 0.5px solid var(--border-mid);
      border-radius: var(--radius-md);
      background: var(--bg-primary);
      color: var(--text-primary);
      font-size: 14px;
      font-family: var(--font-sans);
      outline: none;
      transition: border-color 0.15s, box-shadow 0.15s;
    }

    .form-group input:focus,
    .form-group select:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
    }

    .form-group input::placeholder {
      color: var(--text-tertiary);
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 0.5px solid var(--border-light);
    }

    .btn-cancel {
      background: transparent;
      border: 0.5px solid var(--border-mid);
      border-radius: var(--radius-md);
      padding: 10px 20px;
      font-size: 13px;
      color: var(--text-secondary);
      cursor: pointer;
      font-family: var(--font-sans);
      font-weight: 500;
      transition: all 0.12s;
    }

    .btn-cancel:hover {
      background: var(--bg-secondary);
      border-color: var(--border-strong);
    }

    .btn-save {
      background: var(--accent);
      border: none;
      border-radius: var(--radius-md);
      padding: 10px 20px;
      font-size: 13px;
      font-weight: 500;
      color: #fff;
      cursor: pointer;
      font-family: var(--font-sans);
      transition: background 0.15s;
    }

    .btn-save:hover {
      background: var(--accent-hover);
    }

    @media (max-width: 500px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class MovimientoFormComponent implements OnInit {
  private readonly movimientoService = inject(MovimientoService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  isEditMode = false;
  movimientoId: number | null = null;

  form: MovimientoUpdateDto = {
    fecha: '',
    tipoPrenda: '',
    descripcion: '',
    monto: 0,
    movimiento: ''
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'nuevo') {
      this.isEditMode = true;
      this.movimientoId = +id;
      this.loadMovimiento(+id);
    }
  }

  loadMovimiento(id: number): void {
    this.movimientoService.findAll().subscribe({
      next: (page: Page<Movimiento>) => {
        const mov = page.content.find((m: Movimiento) => m.id === id);
        if (mov) {
          this.form = {
            fecha: mov.fecha,
            tipoPrenda: mov.tipoPrenda,
            descripcion: mov.descripcion,
            monto: mov.monto,
            movimiento: mov.movimiento
          };
        }
      },
      error: (err: Error) => console.error('Error loading movimiento:', err)
    });
  }

  onSubmit(): void {
    if (this.isEditMode && this.movimientoId) {
      this.movimientoService.update(this.movimientoId, this.form).subscribe({
        next: () => this.router.navigate(['/movimientos']),
        error: (err) => console.error('Error updating movimiento:', err)
      });
    } else {
      this.movimientoService.create(this.form as MovimientoCreateDto).subscribe({
        next: () => this.router.navigate(['/movimientos']),
        error: (err) => console.error('Error creating movimiento:', err)
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/movimientos']);
  }
}