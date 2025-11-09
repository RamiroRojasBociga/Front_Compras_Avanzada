import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Marca, MarcaService } from './marca';
import { MarcaDialog } from './marca-dialog/marca-dialog';

@Component({
  standalone: true,
  selector: 'app-marcas',
  providers: [MarcaService],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
    MarcaDialog
  ],
  templateUrl: './marcas.html',
  styleUrls: ['./marcas.css']
})
export class Marcas implements OnInit {
  displayedColumns = ['id', 'nombre', 'acciones'];  // Columnas que se muestran en tabla
  dataSource = new MatTableDataSource<Marca>();    // Fuente de datos para la tabla

  private marcaService = inject(MarcaService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.loadMarcas();  // Cargar marcas al iniciar componente
  }

  // Método que consulta marcas desde backend
  loadMarcas(): void {
    this.marcaService.getMarcas().subscribe({
      next: (marcas) => this.dataSource.data = marcas,
      error: (error) => console.error('Error cargando marcas:', error)
    });
  }

  // Abre diálogo de creación/edición de marca pasando la marca si aplica
  openDialog(marca?: Marca): void {
    const dialogRef = this.dialog.open(MarcaDialog, {
      width: '430px',
      data: marca ? { ...marca } : {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.marcaService.actualizarMarca(result).subscribe({
            next: () => this.loadMarcas(),
            error: (error) => console.error('Error actualizando marca:', error)
          });
        } else {
          this.marcaService.crearMarca({ nombre: result.nombre }).subscribe({
            next: () => this.loadMarcas(),
            error: (error) => console.error('Error creando marca:', error)
          });
        }
      }
    });
  }

  // Elimina marca por id con confirmación previa
  deleteMarca(id?: number): void {
    if (id && confirm('¿Está seguro de eliminar esta marca?')) {
      this.marcaService.eliminarMarca(id).subscribe({
        next: () => this.loadMarcas(),
        error: (error) => console.error('Error eliminando marca:', error)
      });
    }
  }
}
