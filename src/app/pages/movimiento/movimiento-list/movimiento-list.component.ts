import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MovimientoService } from '../../../services/movimiento.service';
import { Movimiento, Page } from '../../../models/movimiento.model';
import { TotalComponent } from '../../total/total.component';

@Component({
  selector: 'app-movimiento-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TotalComponent],
  templateUrl: './movimiento-list.component.html',
  styleUrl: './movimiento-list.component.css'
})
export class MovimientoListComponent implements OnInit {
  private readonly movimientoService = inject(MovimientoService);
  private readonly router = inject(Router);

  movimientos: Movimiento[] = [];
  filteredMovimientos: Movimiento[] = [];
  searchTerm = '';

  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  dupModalOpen = false;
  dupCode = '';
  dupCantidad = 1;
  dupError = false;
  dupErrorMsg = '';
  selectedMovimiento: Movimiento | null = null;
  dupPreviewPlaceholder = 'Seleccioná un movimiento para ver el detalle';
  dupHint = 'Se insertará 1 copia';

  ngOnInit(): void {
    this.loadMovimientos();
  }

  loadMovimientos(): void {
    this.movimientoService.findAll(this.currentPage, this.pageSize).subscribe({
      next: (page: Page<Movimiento>) => {
        this.movimientos = page.content;
        this.filteredMovimientos = [...this.movimientos];
        this.totalElements = page.totalElements;
        this.totalPages = page.totalPages;
      },
      error: (err: Error) => console.error('Error loading movimientos:', err)
    });
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

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages) return;
    this.currentPage = page;
    this.loadMovimientos();
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  onPageSizeChange(): void {
    this.currentPage = 0;
    this.loadMovimientos();
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
      },
      error: (err: Error) => console.error('Error deleting movimiento:', err)
    });
  }

  getBadgeClass(tipo: string): string {
    if (!tipo) return '';

    const tipoNormalizado = tipo.toLowerCase().trim();

    if (tipoNormalizado.includes('venta')) {
      return 'badge-venta';
    }
    if (tipoNormalizado.includes('compra')) {
      return 'badge-compra';
    }
    if (tipoNormalizado.includes('devoluci')) {
      return 'badge-devolucion';
    }

    return '';
  }

  openDupModal(): void {
    this.dupModalOpen = true;
    this.dupCode = '';
    this.dupCantidad = 1;
    this.dupError = false;
    this.dupErrorMsg = '';
    this.selectedMovimiento = null;
    this.dupPreviewPlaceholder = 'Ingresá un código y presioná Buscar';
    this.dupHint = 'Se insertará 1 copia';
  }

  closeDupModal(): void {
    this.dupModalOpen = false;
  }

  overlayClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeDupModal();
    }
  }

  onCodeInput(): void {
    this.dupError = false;
    if (!this.dupCode.trim()) {
      this.selectedMovimiento = null;
      this.dupPreviewPlaceholder = 'Ingresá un código y presioná Buscar';
    }
  }

  buscarMovimiento(): void {
    const code = this.dupCode.trim();
    if (!code) {
      this.dupError = true;
      this.dupErrorMsg = 'Ingresá un código para buscar.';
      this.selectedMovimiento = null;
      this.dupPreviewPlaceholder = 'Ingresá un código y presioná Buscar';
      return;
    }

    const mov = this.movimientos.find(m => m.id.toString() === code);
    if (!mov) {
      this.dupError = true;
      this.dupErrorMsg = `No existe ningún movimiento con el código "${code}".`;
      this.selectedMovimiento = null;
      this.dupPreviewPlaceholder = 'Ingresá un código y presioná Buscar';
      return;
    }

    this.dupError = false;
    this.selectedMovimiento = mov;
    this.dupPreviewPlaceholder = '';
  }

  updateHint(): void {
    const n = this.dupCantidad || 0;
    if (n > 0) {
      this.dupHint = n === 1
        ? 'Se insertará 1 copia'
        : `Se insertarán ${n} copias`;
    } else {
      this.dupHint = 'Ingresá un número mayor a 0';
    }
  }

  confirmDuplicate(): void {
    if (!this.selectedMovimiento || this.dupCantidad < 1) return;

    this.movimientoService.duplicate(this.selectedMovimiento.id, this.dupCantidad).subscribe({
      next: (nuevos) => {
        this.movimientos = [...this.movimientos, ...nuevos];
        this.filteredMovimientos = [...this.movimientos];
        this.totalElements += nuevos.length;
        this.closeDupModal();
      },
      error: (err: Error) => console.error('Error duplicando movimiento:', err)
    });
  }
}