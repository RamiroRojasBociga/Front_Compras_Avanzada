import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PageToolbar } from '../shared/page-toolbar/page-toolbar';

import { Usuario, UsuarioRequest, UsuarioService } from './usuario';
import { UsuarioDialog } from './usuario-dialog/usuario-dialog';

/* Componente standalone para gestión CRUD de usuarios */
/* Implementa desactivación visual en lugar de eliminación física */
@Component({
  standalone: true,
  selector: 'app-usuarios',
  providers: [UsuarioService],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    PageToolbar,
    MatTooltipModule,
    UsuarioDialog
  ],
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.css']
})
export class Usuarios implements OnInit {
  /* Columnas a mostrar en la tabla (sin password por seguridad) */
  displayedColumns = ['idUsuario', 'nombre', 'email', 'telefono', 'estado', 'acciones'];

  /* DataSource de Angular Material para la tabla */
  dataSource = new MatTableDataSource<Usuario>();

  /* Lista reactiva de IDs de usuarios desactivados solo en el front */
  /* Esta señal permite marcar visualmente quién está inactivo */
  usuariosDesactivados = signal<Set<number>>(new Set<number>());

  private usuarioService = inject(UsuarioService);
  private dialog = inject(MatDialog);

  /* Carga inicial de usuarios al montar el componente */
  ngOnInit(): void {
    this.loadUsuarios();
  }

  /* Obtiene todos los usuarios del backend y actualiza la tabla */
  loadUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: usuarios => {
        this.dataSource.data = usuarios;
      },
      error: error => console.error('Error al cargar usuarios:', error)
    });
  }

  /* Verifica si un usuario está marcado como desactivado en el front */
  isUsuarioDesactivado(usuario: Usuario): boolean {
    const set = this.usuariosDesactivados();
    return usuario.idUsuario != null && set.has(usuario.idUsuario);
  }

  /* Marca o desmarca un usuario como desactivado solo en el front */
  /* No toca base de datos ni backend para el estado */
  toggleDesactivarUsuario(usuario: Usuario): void {
    if (!usuario.idUsuario) {
      return;
    }

    const set = new Set(this.usuariosDesactivados());

    /* Si ya está desactivado, lo volvemos a activar visualmente */
    if (set.has(usuario.idUsuario)) {
      set.delete(usuario.idUsuario);
    } else {
      set.add(usuario.idUsuario);
    }

    this.usuariosDesactivados.set(set);

    /* Opcional: aquí se podría cambiar la contraseña por una aleatoria
       llamando a actualizarUsuario, si el flujo de negocio lo permite */
  }

  /* Abre el diálogo para crear o editar usuario */
  /* En edición se pasan los datos del usuario seleccionado */
  openDialog(usuario?: Usuario): void {
    const dialogRef = this.dialog.open(UsuarioDialog, {
      width: '480px',
      data: usuario ? { ...usuario } : {}
    });

    /* Al cerrar el diálogo, si hay resultado, ejecuta crear o actualizar */
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.idUsuario) {
          // Actualiza usuario existente
          // Si password está vacío, el backend debe mantener el anterior
          const payload: UsuarioRequest = {
            nombre: result.nombre,
            email: result.email,
            telefono: result.telefono,
            password: result.password ?? ''
          };

          this.usuarioService.actualizarUsuario(result.idUsuario, payload).subscribe({
            next: () => this.loadUsuarios(),
            error: error => console.error('Error al actualizar usuario:', error)
          });
        } else {
          /* Crear nuevo usuario */
          const payload: UsuarioRequest = {
            nombre: result.nombre,
            email: result.email,
            telefono: result.telefono,
            password: result.password
          };

          this.usuarioService.crearUsuario(payload).subscribe({
            next: () => this.loadUsuarios(),
            error: error => console.error('Error al crear usuario:', error)
          });
        }
      }
    });
  }

  /* Acción de eliminar ya no se usa por restricción del negocio */
  /* Se deja el método solo como referencia pero no se llama desde la UI */
  deleteUsuario(id?: number): void {
    if (id && confirm('¿Estás seguro de eliminar este usuario?')) {
      this.usuarioService.eliminarUsuario(id).subscribe({
        next: () => this.loadUsuarios(),
        error: error => console.error('Error al eliminar usuario:', error)
      });
    }
  }
}
