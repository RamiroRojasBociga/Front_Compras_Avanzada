import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Interfaz que representa un Producto alineada con ProductoResponseDto del backend
export interface Producto {
  idProducto?: number;
  nombre: string;
  idCategoria: number;
  nombreCategoria?: string;
  idMarca: number;
  nombreMarca?: string;
  idUnidadMedida: number;
  nombreUnidadMedida?: string;
  cantidadUnidadesMedida: number;
  idImpuesto: number;
  nombreImpuesto?: string;
  porcentajeImpuesto?: number;
  precio: number;
  stock: number;
  estado: string; // 'ACTIVO' o 'INACTIVO'
  descripcion?: string;
}

// Servicio standalone para CRUD de productos
@Injectable({ providedIn: 'root' })
export class ProductoService {
  private apiUrl = `${environment.apiUrl}/productos`; // Endpoint backend
  private http = inject(HttpClient);

  // Obtiene todos los productos
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  // Obtiene un producto por ID
  getProductoById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  // Obtiene productos activos
  getProductosActivos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/activos`);
  }

  // Crea un nuevo producto
  crearProducto(producto: Omit<Producto, 'idProducto' | 'nombreCategoria' | 'nombreMarca' | 'nombreUnidadMedida' | 'nombreImpuesto' | 'porcentajeImpuesto'>): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto);
  }

  // Actualiza producto por id
  actualizarProducto(id: number, producto: Omit<Producto, 'idProducto' | 'nombreCategoria' | 'nombreMarca' | 'nombreUnidadMedida' | 'nombreImpuesto' | 'porcentajeImpuesto'>): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, producto);
  }

  // Cambia el estado de un producto (NUEVO MÉTODO)
  cambiarEstado(id: number, estado: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/estado`, { estado });
  }
}
