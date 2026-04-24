import { Routes } from '@angular/router';
import { MovimientoListComponent } from './pages/movimiento/movimiento-list/movimiento-list.component';
import { MovimientoFormComponent } from './pages/movimiento/movimiento-form/movimiento-form.component';
import { TotalesComponent } from './pages/totales/totales.component';

export const routes: Routes = [
  { path: '', redirectTo: 'movimientos', pathMatch: 'full' },
  { path: 'movimientos', component: MovimientoListComponent },
  { path: 'movimientos/nuevo', component: MovimientoFormComponent },
  { path: 'movimientos/editar/:id', component: MovimientoFormComponent },
  { path: 'totales', component: TotalesComponent },
];
