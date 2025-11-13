import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Impuesto, ImpuestoService } from './impuesto';
import { ImpuestosDialog } from './impuestos-dialog/impuestos-dialog';

// Componente standalone para CRUD de impuestos
@Component({
  standalone: true,
  selector: 'app-impuestos',
  providers: [ImpuestoService],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
    ImpuestosDialog
  ],
  templateUrl: './impuestos.html',
  styleUrls: ['./impuestos.css']
})
export class Impuestos implements OnInit {
  displayedColumns = ['id', 'nombre', 'porcentaje', 'acciones'];
  dataSource = new MatTableDataSource<Impuesto>();
  private impuestoService = inject(ImpuestoService);
  private dialog = inject(MatDialog);

  // Carga inicial de impuestos
  ngOnInit(): void {
    this.loadImpuestos();
  }

  // Consulta impuestos desde backend
  loadImpuestos(): void {
    this.impuestoService.getImpuestos().subscribe({
      next: (impuestos) => this.dataSource.data = impuestos,
      error: (error) => console.error('Error cargando impuestos:', error)
    });
  }

  // Abre diálogo para crear o editar
  openDialog(impuesto?: Impuesto): void {
    const dialogRef = this.dialog.open(ImpuestosDialog, {
      width: '430px',
      data: impuesto ? { ...impuesto } : {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          // Actualizar - ahora pasa id y el objeto por separado
          this.impuestoService.actualizarImpuesto(result.id, result).subscribe({
            next: () => this.loadImpuestos(),
            error: (error) => console.error('Error actualizando impuesto:', error)
          });
        } else {
          // Crear
          this.impuestoService.crearImpuesto({
            nombre: result.nombre,
            porcentaje: result.porcentaje
          }).subscribe({
            next: () => this.loadImpuestos(),
            error: (error) => console.error('Error creando impuesto:', error)
          });
        }
      }
    });
  }

  // Elimina impuesto con confirmación
  deleteImpuesto(id?: number): void {
    if (id && confirm('¿Está seguro de eliminar este impuesto?')) {
      this.impuestoService.eliminarImpuesto(id).subscribe({
        next: () => this.loadImpuestos(),
        error: (error) => console.error('Error eliminando impuesto:', error)
      });
    }
  }
}
