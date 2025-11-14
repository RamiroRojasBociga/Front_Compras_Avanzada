import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/* Modelo Usuario alineado con UsuarioResponseDto del backend */
/* No incluye password por seguridad (solo se envía en Request) */
export interface Usuario {
  idUsuario?: number;    /* ID opcional para creación */
  nombre: string;        /* Nombre completo del usuario */
  email: string;         /* Email único del usuario */
  telefono: string;      /* Teléfono de contacto */
}

/* DTO para enviar al backend en creación/actualización */
export interface UsuarioRequest {
  nombre: string;
  email: string;
  telefono: string;
  password: string;      /* Password solo se envía, nunca se recibe */
}

/* Servicio standalone para operaciones CRUD de usuarios */
@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = `${environment.apiUrl}/usuarios`;
  private http = inject(HttpClient);

  /* Obtiene todos los usuarios (sin passwords) */
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  /* Obtiene un usuario específico por ID */
  getUsuarioById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  /* Crea un nuevo usuario con password */
  crearUsuario(usuario: UsuarioRequest): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  // Actualiza usuario existente
  // Si password está vacío, el backend debe mantener el anterior
  actualizarUsuario(id: number, usuario: UsuarioRequest): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario);
  }

  /* Elimina un usuario por ID (no se usará en la UI por la restricción) */
  eliminarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
