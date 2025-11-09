import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Interfaz para una categoría (debe coincidir con el DTO Response del backend)
export interface Categoria {
  id: number;          // Identificador único de la categoría (debe ser 'id', no 'idCategoria')
  nombre: string;      // Nombre de la categoría
}

// Servicio standalone para operaciones CRUD sobre categorías
@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private apiUrl = `${environment.apiUrl}/categorias`;
  private http = inject(HttpClient);

  // Trae todos los items
  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }

  // Crea una nueva categoría
  crearCategoria(categoria: { nombre: string }): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, { nombre: categoria.nombre });
  }

  // Actualiza categoría existente por id
  actualizarCategoria(id: number, categoria: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}/${id}`, { nombre: categoria.nombre });
  }

  // Elimina una categoría por id
  eliminarCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
