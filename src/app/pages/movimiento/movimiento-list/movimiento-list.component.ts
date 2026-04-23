import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MovimientoService } from '../../../services/movimiento.service';
import { Movimiento, Page } from '../../../models/movimiento.model';

@Component({
  selector: 'app-movimiento-list',
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
      <h1 class="page-title">Listado de movimientos</h1>

      <div class="stats">
        <div class="stat-card">
          <div class="stat-label">Total registros</div>
          <div class="stat-value neutral" id="statTotal">{{ totalRegistros }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Ventas</div>
          <div class="stat-value green">{{ totalVentas | currency:'USD' }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Compras</div>
          <div class="stat-value blue">{{ totalCompras | currency:'USD' }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Devoluciones</div>
          <div class="stat-value amber">{{ totalDevoluciones | currency:'USD' }}</div>
        </div>
      </div>

      <div class="toolbar">
        <button class="btn-new" (click)="nuevoMovimiento()">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M6.5 1.5v10M1.5 6.5h10" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
          Nuevo movimiento
        </button>
        <div class="search-wrap">
          <svg class="search-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
            <circle cx="6.5" cy="6.5" r="4.5"/>
            <path d="M10.5 10.5l3 3"/>
          </svg>
          <input
            class="search-input"
            type="text"
            id="searchInput"
            placeholder="Buscar por descripción…"
            [(ngModel)]="searchTerm"
            (input)="filterTable()"
          />
        </div>
        <button class="btn-clear" (click)="clearSearch()">Limpiar</button>
      </div>

      <div class="table-wrap">
        <table id="movTable">
          <thead>
            <tr>
              <th style="width:48px">ID</th>
              <th style="width:120px">Fecha</th>
              <th style="width:110px">Tipo prenda</th>
              <th>Descripción</th>
              <th style="width:110px">Monto</th>
              <th style="width:110px">Movimiento</th>
              <th style="width:145px">Creado en</th>
              <th style="width:76px">Editar</th>
              <th style="width:84px">Eliminar</th>
            </tr>
          </thead>
          <tbody id="tableBody">
            @for (mov of filteredMovimientos; track mov.id) {
              <tr [attr.data-desc]="mov.descripcion.toLowerCase()">
                <td class="td-id">{{ mov.id }}</td>
                <td class="td-date">{{ mov.fecha | date:'mediumDate' }}</td>
                <td>{{ mov.tipoPrenda }}</td>
                <td>{{ mov.descripcion }}</td>
                <td class="td-amount">{{ mov.monto | currency:'USD' }}</td>
                <td>
                  <span class="badge" [ngClass]="getBadgeClass(mov.movimiento)">{{ mov.movimiento }}</span>
                </td>
                <td class="td-created">{{ mov.creadoEn | date:'dd/MM/yyyy HH:mm' }}</td>
                <td><button class="btn-edit" (click)="editarMovimiento(mov)">Editar</button></td>
                <td><button class="btn-del" (click)="eliminarMovimiento(mov)">Eliminar</button></td>
              </tr>
            } @empty {
              <tr>
                <td colspan="9" class="empty-state">No hay movimientos registrados</td>
              </tr>
            }
          </tbody>
        </table>
        <div class="table-footer" id="tableFooter">Mostrando {{ filteredMovimientos.length }} de {{ movimientos.length }} registros</div>
      </div>
    </main>
  `,
  styles: [`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

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
      max-width: 1140px;
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

    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 12px;
      margin-bottom: 28px;
    }

    .stat-card {
      background: var(--bg-primary);
      border: 0.5px solid var(--border-light);
      border-radius: var(--radius-md);
      padding: 14px 18px;
    }

    .stat-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      color: var(--text-tertiary);
      font-weight: 500;
      margin-bottom: 6px;
    }

    .stat-value {
      font-size: 20px;
      font-weight: 600;
      font-family: var(--font-mono);
    }

    .stat-value.neutral { color: var(--text-primary); }
    .stat-value.green   { color: #3b6d11; }
    .stat-value.blue    { color: #185fa5; }
    .stat-value.amber   { color: #854f0b; }

    .toolbar {
      display: flex;
      gap: 10px;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .btn-new {
      background: var(--accent);
      color: #fff;
      border: none;
      border-radius: var(--radius-md);
      padding: 10px 18px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      font-family: var(--font-sans);
      display: flex; align-items: center; gap: 7px;
      transition: background 0.15s;
      white-space: nowrap;
    }
    .btn-new:hover { background: var(--accent-hover); }

    .search-wrap {
      flex: 1;
      min-width: 200px;
      position: relative;
    }

    .search-icon {
      position: absolute;
      left: 11px; top: 50%;
      transform: translateY(-50%);
      width: 15px; height: 15px;
      color: var(--text-tertiary);
      pointer-events: none;
    }

    .search-input {
      width: 100%;
      padding: 10px 12px 10px 34px;
      border: 0.5px solid var(--border-mid);
      border-radius: var(--radius-md);
      background: var(--bg-primary);
      color: var(--text-primary);
      font-size: 13px;
      font-family: var(--font-sans);
      outline: none;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .search-input:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
    }
    .search-input::placeholder { color: var(--text-tertiary); }

    .btn-clear {
      background: transparent;
      border: 0.5px solid var(--border-mid);
      border-radius: var(--radius-md);
      padding: 10px 16px;
      font-size: 13px;
      color: #a32d2d;
      cursor: pointer;
      font-family: var(--font-sans);
      font-weight: 500;
      transition: background 0.15s;
      white-space: nowrap;
    }
    .btn-clear:hover { background: #fcebeb; border-color: #f09595; }

    .table-wrap {
      border: 0.5px solid var(--border-light);
      border-radius: var(--radius-lg);
      overflow: hidden;
      background: var(--bg-primary);
      box-shadow: 0 1px 4px rgba(0,0,0,0.05);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }

    thead th {
      background: var(--header-bg);
      color: #b8bcd0;
      text-align: left;
      padding: 12px 16px;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      white-space: nowrap;
    }

    tbody tr {
      background: var(--bg-primary);
      transition: background 0.1s;
    }

    tbody tr:nth-child(even) { background: #fafaf8; }
    tbody tr:hover { background: #eef3ff; }

    tbody td {
      padding: 13px 16px;
      border-bottom: 0.5px solid var(--border-light);
      color: var(--text-primary);
      vertical-align: middle;
      white-space: nowrap;
    }

    tbody tr:last-child td { border-bottom: none; }

    .td-id {
      font-family: var(--font-mono);
      font-size: 12px;
      color: var(--text-tertiary);
      font-weight: 500;
    }

    .td-date { color: var(--text-secondary); }

    .td-amount {
      font-family: var(--font-mono);
      font-weight: 500;
    }

    .td-created {
      color: var(--text-tertiary);
      font-size: 12px;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .badge-venta     { background: #eaf3de; color: #3b6d11; }
    .badge-compra    { background: #e6f1fb; color: #185fa5; }
    .badge-devolucion{ background: #faeeda; color: #854f0b; }

    .btn-edit {
      background: transparent;
      border: 0.5px solid var(--border-mid);
      border-radius: 6px;
      padding: 5px 12px;
      font-size: 12px;
      color: var(--text-secondary);
      cursor: pointer;
      font-family: var(--font-sans);
      font-weight: 500;
      transition: all 0.12s;
    }
    .btn-edit:hover {
      background: var(--bg-secondary);
      color: var(--text-primary);
      border-color: var(--border-strong);
    }

    .btn-del {
      background: #fcebeb;
      border: none;
      border-radius: 6px;
      padding: 5px 12px;
      font-size: 12px;
      color: #a32d2d;
      cursor: pointer;
      font-family: var(--font-sans);
      font-weight: 500;
      transition: background 0.12s;
    }
    .btn-del:hover { background: #f7c1c1; }

    .empty-state {
      text-align: center;
      padding: 48px 24px;
      color: var(--text-tertiary);
      font-size: 14px;
    }

    .table-footer {
      padding: 10px 16px;
      font-size: 12px;
      color: var(--text-tertiary);
      border-top: 0.5px solid var(--border-light);
      background: var(--bg-secondary);
    }

    @media (max-width: 700px) {
      .main { padding: 24px 14px 48px; }
      .page-title { font-size: 22px; }
      .stats { grid-template-columns: 1fr 1fr; }
      .table-wrap { overflow-x: auto; }
      table { min-width: 700px; }
    }
  `]
})
export class MovimientoListComponent implements OnInit {
  private readonly movimientoService = inject(MovimientoService);
  private readonly router = inject(Router);

  movimientos: Movimiento[] = [];
  filteredMovimientos: Movimiento[] = [];
  searchTerm = '';

  totalRegistros = 0;
  totalVentas = 0;
  totalCompras = 0;
  totalDevoluciones = 0;

  ngOnInit(): void {
    this.loadMovimientos();
  }

  loadMovimientos(): void {
    this.movimientoService.findAll().subscribe({
      next: (page: Page<Movimiento>) => {
        this.movimientos = page.content;
        this.filteredMovimientos = [...this.movimientos];
        this.calculateStats();
      },
      error: (err) => console.error('Error loading movimientos:', err)
    });
  }

  calculateStats(): void {
    this.totalRegistros = this.movimientos.length;
    this.totalVentas = this.movimientos
      .filter(m => m.movimiento === 'VENTA')
      .reduce((sum, m) => sum + m.monto, 0);
    this.totalCompras = this.movimientos
      .filter(m => m.movimiento === 'COMPRA')
      .reduce((sum, m) => sum + m.monto, 0);
    this.totalDevoluciones = this.movimientos
      .filter(m => m.movimiento === 'DEVOLUCION')
      .reduce((sum, m) => sum + m.monto, 0);
  }

  filterTable(): void {
    const q = this.searchTerm.toLowerCase().trim();
    if (!q) {
      this.filteredMovimientos = [...this.movimientos];
    } else {
      this.filteredMovimientos = this.movimientos.filter(m => 
        m.descripcion.toLowerCase().includes(q)
      );
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filterTable();
  }

  nuevoMovimiento(): void {
    this.router.navigate(['/movimientos/nuevo']);
  }

  editarMovimiento(mov: Movimiento): void {
    this.router.navigate(['/movimientos/editar', mov.id]);
  }

  eliminarMovimiento(mov: Movimiento): void {
    if (!confirm('¿Eliminar este movimiento?')) return;
    
    this.movimientoService.deleteById(mov.id).subscribe({
      next: () => {
        this.movimientos = this.movimientos.filter(m => m.id !== mov.id);
        this.filterTable();
        this.calculateStats();
      },
      error: (err) => console.error('Error deleting movimiento:', err)
    });
  }

  getBadgeClass(tipo: string): string {
    // 1. Si viene nulo o indefinido, salimos rápido
    if (!tipo) return '';
  
    // 2. Pasamos a minúsculas y quitamos espacios en blanco de los extremos
    const tipoNormalizado = tipo.toLowerCase().trim();
  
    // 3. Evaluamos usando "includes" para atrapar variaciones
    if (tipoNormalizado.includes('venta')) {
      return 'badge-venta';
    } 
    if (tipoNormalizado.includes('compra')) {
      return 'badge-compra';
    } 
    if (tipoNormalizado.includes('devoluci')) { 
      // Usar 'devoluci' atrapa tanto 'devolución' (con tilde) como 'devolucion' (sin tilde)
      return 'badge-devolucion';
    }
  
    return '';
  }
}