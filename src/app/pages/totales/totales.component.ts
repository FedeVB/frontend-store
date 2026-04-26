import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovimientoService } from '../../services/movimiento.service';
import { Movimiento, Page } from '../../models/movimiento.model';

@Component({
  selector: 'app-totales',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './totales.component.html',
  styleUrl: './totales.component.css'
})
export class TotalesComponent implements OnInit {
  private readonly movimientoService = inject(MovimientoService);

  totalVentas = 0;
  totalCompras = 0;
  totalDevoluciones = 0;
  totalRegistros = 0;

  ventasCount = 0;
  comprasCount = 0;
  devolucionesCount = 0;

  loading = true;

  ngOnInit(): void {
    this.loadTotales();
  }

  loadTotales(): void {
    this.loading = true;
    this.movimientoService.findAll(0, 1000).subscribe({
      next: (page: Page<Movimiento>) => {
        const movimientos = page.content;
        this.totalRegistros = page.totalElements;

        const ventas = movimientos.filter(m => m.movimiento === 'VENTA');
        const compras = movimientos.filter(m => m.movimiento === 'COMPRA');
        const devoluciones = movimientos.filter(m => m.movimiento === 'DEVOLUCION');

        this.ventasCount = ventas.length;
        this.comprasCount = compras.length;
        this.devolucionesCount = devoluciones.length;

        this.totalVentas = ventas.reduce((sum, m) => sum + m.monto, 0);
        this.totalCompras = compras.reduce((sum, m) => sum + m.monto, 0);
        this.totalDevoluciones = devoluciones.reduce((sum, m) => sum + m.monto, 0);

        this.loading = false;
      },
      error: (err: Error) => {
        console.error('Error loading totales:', err);
        this.loading = false;
      }
    });
  }

  getBalance(): number {
    return this.totalVentas - this.totalCompras - this.totalDevoluciones;
  }

  getProfitMargin(): number {
    const ingresos = this.totalVentas;
    if (ingresos === 0) return 0;
    const gastos = this.totalCompras + this.totalDevoluciones;
    return ((ingresos - gastos) / ingresos) * 100;
  }
}