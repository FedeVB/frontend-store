import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Total } from '../models/totales.models';
import { HttpClient } from '@angular/common/http';

const API_URL = "http://localhost:8080/movimientos"
@Injectable({
  providedIn: 'root'
})
export class TotalesService {

  private readonly http = inject(HttpClient);

  constructor() {
    this.getTotales().subscribe(data => console.log('Json de Spring : ' + JSON.stringify(data)))
  }


  getTotales(): Observable<Total> {
    return this.http.get<Total>(`${API_URL}/totals`)
  }
}
