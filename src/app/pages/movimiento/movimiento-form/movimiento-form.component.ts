import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { MovimientoService } from '../../../services/movimiento.service';
import { Movimiento, MovimientoCreateDto, MovimientoUpdateDto, Page } from '../../../models/movimiento.model';

@Component({
  selector: 'app-movimiento-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './movimiento-form.component.html',
  styleUrl: './movimiento-form.component.css'
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