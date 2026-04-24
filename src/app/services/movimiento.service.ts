import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movimiento, MovimientoCreateDto, MovimientoUpdateDto, Page } from '../models/movimiento.model';

const API_URL = 'http://localhost:8080/movimientos';

@Injectable({
  providedIn: 'root'
})
export class MovimientoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_URL;

  findAll(page: number = 0, size: number = 20): Observable<Page<Movimiento>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<Movimiento>>(this.baseUrl, { params });
  }

  deleteById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  update(id: number, dto: MovimientoUpdateDto): Observable<Movimiento> {
    return this.http.put<Movimiento>(`${this.baseUrl}/${id}`, dto);
  }

  create(dto: MovimientoCreateDto): Observable<Movimiento> {
    return this.http.post<Movimiento>(this.baseUrl, dto);
  }

  search(
    tipoPrenda?: string,
    movimiento?: string,
    page: number = 0,
    size: number = 20
  ): Observable<Page<Movimiento>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (tipoPrenda) {
      params = params.set('tipoPrenda', tipoPrenda);
    }
    if (movimiento) {
      params = params.set('movimiento',movimiento);
    }

    return this.http.get<Page<Movimiento>>(`${this.baseUrl}/search`, { params });
  }

  duplicate(id: number, cantidad: number): Observable<Movimiento[]> {
    return this.http.get<Movimiento[]>(`${this.baseUrl}/duplicate/id/${id}/cantidad/${cantidad}`);
  }
}