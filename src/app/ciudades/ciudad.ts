import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


// Modelo Ciudad alineado con DTO backend
export interface Ciudad {
  id?: number;  // ID puede ser opcional para creación
  nombre: string;
}

// Servicio standalone para CRUD ciudades
@Injectable({ providedIn: 'root' })
export class CiudadService {
  private apiUrl = `${environment.apiUrl}/ciudades`;
  private http = inject(HttpClient);

  // Obtiene todas las ciudades
  getCiudades(): Observable<Ciudad[]> {
    return this.http.get<Ciudad[]>(this.apiUrl);
  }

  // Crea una ciudad nueva
  crearCiudad(ciudad: { nombre: string }): Observable<Ciudad> {
    return this.http.post<Ciudad>(this.apiUrl, { nombre: ciudad.nombre });
  }

  // Actualiza ciudad por id
  actualizarCiudad(id: number, ciudad: Ciudad): Observable<Ciudad> {
    return this.http.put<Ciudad>(`${this.apiUrl}/${id}`, { nombre: ciudad.nombre });
  }

  // Elimina ciudad por id
  eliminarCiudad(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}