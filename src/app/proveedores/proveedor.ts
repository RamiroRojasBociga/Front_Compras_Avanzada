import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Interfaz que representa un Proveedor alineada con ProveedorResponseDto del backend
export interface Proveedor {
  idProveedor?: number;     // ID puede ser opcional para creación
  nombre: string;           // Nombre del proveedor
  idCiudad: number;         // ID de la ciudad asociada
  nombreCiudad?: string;    // Nombre de la ciudad (solo en respuesta)
  direccion: string;        // Dirección física
  email: string;            // Correo electrónico
  estado: string;           // Estado: 'ACTIVO' o 'INACTIVO'
  fechaRegistro?: string;   // Fecha de registro (solo en respuesta)
  telefonos: string[];      // Lista de números telefónicos
}

// Servicio standalone para CRUD de proveedores
@Injectable({ providedIn: 'root' })
export class ProveedorService {
  private apiUrl = `${environment.apiUrl}/proveedores`; // Endpoint backend
  private http = inject(HttpClient);

  // Obtiene todos los proveedores
  getProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(this.apiUrl);
  }

  // Obtiene un proveedor por ID
  getProveedorById(id: number): Observable<Proveedor> {
    return this.http.get<Proveedor>(`${this.apiUrl}/${id}`);
  }

  // Crea un nuevo proveedor
  crearProveedor(proveedor: Omit<Proveedor, 'idProveedor' | 'nombreCiudad' | 'fechaRegistro'>): Observable<Proveedor> {
    return this.http.post<Proveedor>(this.apiUrl, proveedor);
  }

  // Actualiza proveedor por id
  actualizarProveedor(id: number, proveedor: Omit<Proveedor, 'idProveedor' | 'nombreCiudad' | 'fechaRegistro'>): Observable<Proveedor> {
    return this.http.put<Proveedor>(`${this.apiUrl}/${id}`, proveedor);
  }

  // Elimina proveedor por id
  eliminarProveedor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
