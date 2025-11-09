import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Interfaz para definir la estructura de una Marca
export interface Marca {
  id?: number;      // Identificador único de la marca (opcional para creación)
  nombre: string;   // Nombre de la marca
}

// Servicio Angular standalone para manejo CRUD de marcas
@Injectable({ providedIn: 'root' })
export class MarcaService {
  private apiUrl = `${environment.apiUrl}/marcas`;  // Endpoint REST marcas

  private http = inject(HttpClient);  // HttpClient inyectado

  // Obtiene todas las marcas registradas
  getMarcas(): Observable<Marca[]> {
    return this.http.get<Marca[]>(this.apiUrl);
  }

  // Crea una nueva marca (envía solo nombre)
  crearMarca(marca: { nombre: string }): Observable<Marca> {
    return this.http.post<Marca>(this.apiUrl, { nombre: marca.nombre });
  }

  // Actualiza marca existente por id, enviando solo el nombre
  actualizarMarca(marca: Marca): Observable<Marca> {
    return this.http.put<Marca>(`${this.apiUrl}/${marca.id}`, { nombre: marca.nombre });
  }

  // Elimina marca por id
  eliminarMarca(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
