import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// ========================================
// INTERFAZ PARA DEFINIR ESTRUCTURA DE DATOS
// ========================================


export interface UnidadMedida {
  id?: number;       // Identificador único (Long en backend)
  nombre: string;    // Nombre de la unidad
}

// ========================================
// SERVICIO ANGULAR STANDALONE PARA CRUD
// ========================================


@Injectable({ providedIn: 'root' })
export class UnidadMedidaService {
  // URL del endpoint REST - IMPORTANTE: unidades_medida con guion bajo
  private apiUrl = `${environment.apiUrl}/unidades_medida`;

  // Inyección de HttpClient
  private http = inject(HttpClient);

  /**
   * Obtiene todas las unidades de medida registradas
   * GET /api/unidades_medida
   * @returns Observable con array de UnidadMedida
   */
  getUnidades(): Observable<UnidadMedida[]> {
    return this.http.get<UnidadMedida[]>(this.apiUrl);
  }

  /**
   * Crea una nueva unidad de medida
   * POST /api/unidades_medida
   * Envía UnidadMedidaRequestDto (solo nombre)
   * @param unidad Objeto con el nombre de la unidad
   * @returns Observable con UnidadMedidaResponseDto
   */
  crearUnidad(unidad: { nombre: string }): Observable<UnidadMedida> {
    return this.http.post<UnidadMedida>(this.apiUrl, { nombre: unidad.nombre });
  }

  /**
   * Actualiza una unidad existente por id
   * PUT /api/unidades_medida/{id}
   * Envía UnidadMedidaRequestDto (solo nombre)
   * @param unidad Objeto UnidadMedida con id y nombre
   * @returns Observable con UnidadMedidaResponseDto actualizado
   */
  actualizarUnidad(unidad: UnidadMedida): Observable<UnidadMedida> {
    return this.http.put<UnidadMedida>(`${this.apiUrl}/${unidad.id}`, { nombre: unidad.nombre });
  }

  /**
   * Elimina una unidad de medida por id
   * DELETE /api/unidades_medida/{id}
   * @param id Identificador de la unidad a eliminar
   * @returns Observable void (HttpStatus.NO_CONTENT)
   */
  eliminarUnidad(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
