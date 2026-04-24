import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TotalesService } from '../../services/totales.service';
@Component({
  selector: 'app-total',
  imports: [CommonModule],
  templateUrl: './total.component.html',
  styleUrl: './total.component.css'
})
export class TotalComponent {

  private readonly totalesService = inject(TotalesService);

  totalRegistros = 0;
  totalVentas = 0;
  totalCompras = 0;
  totalDevoluciones = 0;

  ngOnInit(): void {
    this.totalesService.getTotales()
      .subscribe(totales => {
        this.totalVentas = totales.totalVenta;
        this.totalCompras = totales.totalCompra;
        this.totalDevoluciones = totales.totalDevolucion;
      });
    this.totalRegistros = 100;
  }
}
