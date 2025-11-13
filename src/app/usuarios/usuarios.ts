import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PageToolbar } from '../shared/page-toolbar/page-toolbar';


import { Usuario, UsuarioService } from './usuario';
import { UsuarioDialog } from './usuario-dialog/usuario-dialog';

// Componente standalone para gestión CRUD de usuarios
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
  // Columnas a mostrar en la tabla (sin password por seguridad)
  displayedColumns = ['idUsuario', 'nombre', 'email', 'telefono', 'acciones'];
  dataSource = new MatTableDataSource<Usuario>();
  
  private usuarioService = inject(UsuarioService);
  private dialog = inject(MatDialog);

  // Carga inicial de usuarios al montar el componente
  ngOnInit(): void {
    this.loadUsuarios();
  }

  // Obtiene todos los usuarios del backend y actualiza la tabla
  loadUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: usuarios => this.dataSource.data = usuarios,
      error: error => console.error('Error al cargar usuarios:', error)
    });
  }

  // Abre el diálogo para crear o editar usuario
  // En edición se pasan los datos del usuario seleccionado
  openDialog(usuario?: Usuario): void {
    const dialogRef = this.dialog.open(UsuarioDialog, {
      width: '480px',
      data: usuario ? { ...usuario } : {}
    });

    // Al cerrar el diálogo, si hay resultado, ejecuta crear o actualizar
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.idUsuario) {
          // Actualizar usuario existente
          this.usuarioService.actualizarUsuario(result.idUsuario, result).subscribe({
            next: () => this.loadUsuarios(),
            error: error => console.error('Error al actualizar usuario:', error)
          });
        } else {
          // Crear nuevo usuario
          this.usuarioService.crearUsuario(result).subscribe({
            next: () => this.loadUsuarios(),
            error: error => console.error('Error al crear usuario:', error)
          });
        }
      }
    });
  }

  // Elimina un usuario con confirmación previa
  deleteUsuario(id?: number): void {
    if (id && confirm('¿Estás seguro de eliminar este usuario?')) {
      this.usuarioService.eliminarUsuario(id).subscribe({
        next: () => this.loadUsuarios(),
        error: error => console.error('Error al eliminar usuario:', error)
      });
    }
  }
}
