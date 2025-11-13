import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PageToolbar } from '../shared/page-toolbar/page-toolbar';


// Importa interfaz y servicio desde unidad-medida.ts
import { UnidadMedida, UnidadMedidaService } from './unidad-medida';
// Importa el diálogo
import { UnidadesMedidaDialog } from './unidades-medida-dialog/unidades-medida-dialog';

/**
 * Componente standalone para gestión CRUD de Unidades de Medida.
 * Muestra tabla con listado y permite crear, editar y eliminar.
 */
@Component({
  standalone: true,
  selector: 'app-unidades-medida',
  providers: [UnidadMedidaService],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    PageToolbar,
    MatTooltipModule,
    UnidadesMedidaDialog
  ],
  templateUrl: './unidades-medida.html',
  styleUrls: ['./unidades-medida.css']
})
export class UnidadesMedida implements OnInit {
  // Columnas que se muestran en la tabla
  displayedColumns = ['id', 'nombre', 'acciones'];
  
  // Fuente de datos para Angular Material Table
  dataSource = new MatTableDataSource<UnidadMedida>();

  // Inyección del servicio de unidades
  private unidadService = inject(UnidadMedidaService);
  
  // Inyección del servicio de diálogos de Material
  private dialog = inject(MatDialog);

  /**
   * Hook de inicialización del componente
   * Carga el listado de unidades al iniciar
   */
  ngOnInit(): void {
    this.loadUnidades();
  }

  /**
   * Método que consulta todas las unidades desde el backend
   * y actualiza el datasource de la tabla
   */
  loadUnidades(): void {
    this.unidadService.getUnidades().subscribe({
      next: (unidades) => this.dataSource.data = unidades,
      error: (error) => console.error('Error cargando unidades de medida:', error)
    });
  }

  /**
   * Abre el diálogo para crear o editar una unidad
   * @param unidad Unidad a editar (opcional, si no se pasa crea nueva)
   */
  openDialog(unidad?: UnidadMedida): void {
    const dialogRef = this.dialog.open(UnidadesMedidaDialog, {
      width: '430px',
      data: unidad ? { ...unidad } : {}
    });

    // Escucha el cierre del diálogo
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          // Si tiene ID, actualiza
          this.unidadService.actualizarUnidad(result).subscribe({
            next: () => this.loadUnidades(),
            error: (error) => console.error('Error actualizando unidad:', error)
          });
        } else {
          // Si no tiene ID, crea nueva
          this.unidadService.crearUnidad({ nombre: result.nombre }).subscribe({
            next: () => this.loadUnidades(),
            error: (error) => console.error('Error creando unidad:', error)
          });
        }
      }
    });
  }

  /**
   * Elimina una unidad por ID con confirmación previa
   * @param id Identificador de la unidad a eliminar
   */
  deleteUnidad(id?: number): void {
    if (id && confirm('¿Está seguro de eliminar esta unidad de medida?')) {
      this.unidadService.eliminarUnidad(id).subscribe({
        next: () => this.loadUnidades(),
        error: (error) => console.error('Error eliminando unidad:', error)
      });
    }
  }
}
