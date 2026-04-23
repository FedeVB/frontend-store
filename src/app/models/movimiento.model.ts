export interface Movimiento {
  id: number;
  fecha: string;
  tipoPrenda: string;
  descripcion: string;
  monto: number;
  movimiento: string;
  creadoEn: string;
}

export interface MovimientoUpdateDto {
  fecha: string;
  tipoPrenda: string;
  descripcion: string;
  monto: number;
  movimiento: string;
}

export interface MovimientoCreateDto {
  fecha: string;
  tipoPrenda: string;
  descripcion: string;
  monto: number;
  movimiento: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}