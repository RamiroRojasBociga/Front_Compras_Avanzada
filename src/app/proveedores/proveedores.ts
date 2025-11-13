import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { PageToolbar } from '../shared/page-toolbar/page-toolbar';


import { Proveedor, ProveedorService } from './proveedor';
import { ProveedoresDialog } from './proveedores-dialog/proveedores-dialog';

// Componente standalone para CRUD de proveedores
@Component({
  standalone: true,
  selector: 'app-proveedores',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
    PageToolbar,
    MatChipsModule
    // ❌ NO incluir ProveedoresDialog aquí
  ],
  templateUrl: './proveedores.html',
  styleUrls: ['./proveedores.css']
})
export class Proveedores implements OnInit {
  displayedColumns = ['idProveedor', 'nombre', 'nombreCiudad', 'direccion', 'email', 'estado', 'telefonos', 'acciones'];
  dataSource = new MatTableDataSource<Proveedor>();
  private proveedorService = inject(ProveedorService);
  private dialog = inject(MatDialog);

  // Carga inicial de proveedores
  ngOnInit(): void {
    this.loadProveedores();
  }

  // Consulta proveedores desde backend con logging
  loadProveedores(): void {
    console.log('🔍 Cargando proveedores desde:', this.proveedorService['apiUrl']); // Debug
    this.proveedorService.getProveedores().subscribe({
      next: (proveedores) => {
        console.log('✅ Proveedores recibidos:', proveedores); // Debug
        this.dataSource.data = proveedores;
      },
      error: (error) => {
        console.error('❌ Error cargando proveedores:', error); // Debug
      }
    });
  }

  // Abre diálogo para crear o editar
  openDialog(proveedor?: Proveedor): void {
    const dialogRef = this.dialog.open(ProveedoresDialog, {
      width: '550px',
      data: proveedor ? { ...proveedor } : {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.idProveedor) {
          // Actualizar proveedor existente
          this.proveedorService.actualizarProveedor(result.idProveedor, result).subscribe({
            next: () => this.loadProveedores(),
            error: (error) => console.error('Error actualizando proveedor:', error)
          });
        } else {
          // Crear nuevo proveedor
          this.proveedorService.crearProveedor(result).subscribe({
            next: () => this.loadProveedores(),
            error: (error) => console.error('Error creando proveedor:', error)
          });
        }
      }
    });
  }

  // Elimina proveedor con confirmación
  deleteProveedor(id?: number): void {
    if (id && confirm('¿Está seguro de eliminar este proveedor?')) {
      this.proveedorService.eliminarProveedor(id).subscribe({
        next: () => this.loadProveedores(),
        error: (error) => console.error('Error eliminando proveedor:', error)
      });
    }
  }

  // Retorna clase CSS según estado
  getEstadoClass(estado: string): string {
    return estado === 'ACTIVO' ? 'estado-activo' : 'estado-inactivo';
  }
}
