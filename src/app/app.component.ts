import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TotalesService } from './services/totales.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private totalesService = inject(TotalesService);
  title = 'tienda';
}
