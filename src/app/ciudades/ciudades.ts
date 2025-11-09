import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Ciudad, CiudadService } from './ciudad';
import { CiudadDialog } from './ciudad-dialog/ciudad-dialog';

// Componente standalone para CRUD ciudades
@Component({
  standalone: true,
  selector: 'app-ciudades',
  providers: [CiudadService],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
    CiudadDialog
  ],
  templateUrl: './ciudades.html',
  styleUrls: ['./ciudades.css']
})
export class Ciudades implements OnInit {
  displayedColumns = ['id', 'nombre', 'acciones'];
  dataSource = new MatTableDataSource<Ciudad>();
  private ciudadService = inject(CiudadService);
  private dialog = inject(MatDialog);

  // Cargar listado inicial
  ngOnInit(): void {
    this.loadCiudades();
  }

  // Carga las ciudades desde backend
  loadCiudades(): void {
    this.ciudadService.getCiudades().subscribe({
      next: ciudades => this.dataSource.data = ciudades,
      error: error => console.error('Error al cargar ciudades:', error)
    });
  }

  // Abrir diálogo para crear o editar ciudad
  openDialog(ciudad?: Ciudad): void {
    const dialogRef = this.dialog.open(CiudadDialog, {
      width: '430px',
      data: ciudad ? { ...ciudad } : {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.ciudadService.actualizarCiudad(result.id, result).subscribe({
            next: () => this.loadCiudades(),
            error: error => console.error('Error al actualizar ciudad:', error)
          });
        } else {
          this.ciudadService.crearCiudad({ nombre: result.nombre }).subscribe({
            next: () => this.loadCiudades(),
            error: error => console.error('Error al crear ciudad:', error)
          });
        }
      }
    });
  }

  // Confirmar y eliminar ciudad
  deleteCiudad(id?: number): void {
    if (id && confirm('¿Estás seguro de eliminar esta ciudad?')) {
      this.ciudadService.eliminarCiudad(id).subscribe({
        next: () => this.loadCiudades(),
        error: error => console.error('Error al eliminar ciudad:', error)
      });
    }
  }
}
