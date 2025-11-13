import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Interfaz que representa un Impuesto alineada con ImpuestoResponseDto del backend
export interface Impuesto {
  id?: number;        // ID puede ser opcional para creación
  nombre: string;     // Nombre del impuesto (ej: "IVA 19%")
  porcentaje: number; // Porcentaje decimal (ej: 19.00)
}

// Servicio standalone para CRUD de impuestos
@Injectable({ providedIn: 'root' })
export class ImpuestoService {
  private apiUrl = `${environment.apiUrl}/Impuestos`; // Endpoint backend con I mayúscula
  private http = inject(HttpClient);

  // Obtiene todos los impuestos
  getImpuestos(): Observable<Impuesto[]> {
    return this.http.get<Impuesto[]>(this.apiUrl);
  }

  // Crea un nuevo impuesto
  crearImpuesto(impuesto: { nombre: string; porcentaje: number }): Observable<Impuesto> {
    return this.http.post<Impuesto>(this.apiUrl, {
      nombre: impuesto.nombre,
      porcentaje: impuesto.porcentaje
    });
  }

  // Actualiza impuesto por id (recibe id como parámetro separado)
  actualizarImpuesto(id: number, impuesto: Impuesto): Observable<Impuesto> {
    return this.http.put<Impuesto>(`${this.apiUrl}/${id}`, {
      nombre: impuesto.nombre,
      porcentaje: impuesto.porcentaje
    });
  }

  // Elimina impuesto por id
  eliminarImpuesto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
