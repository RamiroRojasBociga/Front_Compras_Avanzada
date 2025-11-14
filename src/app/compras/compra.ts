import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Interfaz que representa una Compra (CompraResponseDto)
export interface Compra {
  idCompra?: number;
  idUsuario: number;
  nombreUsuario?: string;
  idProveedor: number;
  nombreProveedor?: string;
  fecha: string;
  numFactura?: string;
  estado: string;
  total?: number;
}

// Interfaz para DetalleCompra (DetalleCompraResponseDto)
export interface DetalleCompra {
  idDetalleCompra?: number;
  idCompra: number;
  nombreUsuario?: string;
  idProducto: number;
  nombreProducto?: string;
  cantidad: number;
  precioUnitario?: number;
  subtotal?: number;
}

// Servicio standalone para CRUD de compras
@Injectable({ providedIn: 'root' })
export class CompraService {
  private apiUrl = `${environment.apiUrl}/compras`;
  private http = inject(HttpClient);

  getCompras(): Observable<Compra[]> {
    return this.http.get<Compra[]>(this.apiUrl);
  }

  getCompraById(id: number): Observable<Compra> {
    return this.http.get<Compra>(`${this.apiUrl}/${id}`);
  }

  getComprasByEstado(estado: string): Observable<Compra[]> {
    return this.http.get<Compra[]>(`${this.apiUrl}/estado/${estado}`);
  }

  getComprasPendientes(): Observable<Compra[]> {
    return this.http.get<Compra[]>(`${this.apiUrl}/pendientes`);
  }

  getComprasProcesadas(): Observable<Compra[]> {
    return this.http.get<Compra[]>(`${this.apiUrl}/procesadas`);
  }

  crearCompra(compra: Partial<Compra>): Observable<Compra> {
    return this.http.post<Compra>(this.apiUrl, compra);
  }

  actualizarCompra(id: number, compra: Partial<Compra>): Observable<Compra> {
    return this.http.put<Compra>(`${this.apiUrl}/${id}`, compra);
  }

  eliminarCompra(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cambiarEstado(id: number, estado: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/estado`, estado, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Servicio standalone para CRUD de detalles de compra
@Injectable({ providedIn: 'root' })
export class DetalleCompraService {
  private apiUrl = `${environment.apiUrl}/DetalleCompras`;
  private http = inject(HttpClient);

  getDetalles(): Observable<DetalleCompra[]> {
    return this.http.get<DetalleCompra[]>(this.apiUrl);
  }

  getDetalleById(id: number): Observable<DetalleCompra> {
    return this.http.get<DetalleCompra>(`${this.apiUrl}/${id}`);
  }

  // ✅ MÉTODO CRÍTICO PARA CARGAR DETALLES AL EDITAR
  getDetallesByCompraId(idCompra: number): Observable<DetalleCompra[]> {
    return this.http.get<DetalleCompra[]>(`${this.apiUrl}/compra/${idCompra}`);
  }

  crearDetalle(detalle: Partial<DetalleCompra>): Observable<DetalleCompra> {
    return this.http.post<DetalleCompra>(this.apiUrl, detalle);
  }

  actualizarDetalle(id: number, detalle: Partial<DetalleCompra>): Observable<DetalleCompra> {
    return this.http.put<DetalleCompra>(`${this.apiUrl}/${id}`, detalle);
  }

  eliminarDetalle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
