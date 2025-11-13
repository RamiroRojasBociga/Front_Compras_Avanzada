import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Producto, ProductoService } from './producto';
import { ProductosDialog } from './productos-dialog/productos-dialog';

// Componente standalone para CRUD de productos
@Component({
  standalone: true,
  selector: 'app-productos',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './productos.html',
  styleUrls: ['./productos.css']
})
export class Productos implements OnInit {
  displayedColumns = ['idProducto', 'nombre', 'nombreCategoria', 'nombreMarca', 'precio', 'stock', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<Producto>();
  private productoService = inject(ProductoService);
  private dialog = inject(MatDialog);

  // Carga inicial de productos
  ngOnInit(): void {
    this.loadProductos();
  }

  // Consulta productos desde backend
  loadProductos(): void {
    this.productoService.getProductos().subscribe({
      next: (productos) => {
        console.log('✅ Productos recibidos:', productos);
        this.dataSource.data = productos;
      },
      error: (error) => console.error('❌ Error cargando productos:', error)
    });
  }

  // Abre diálogo para crear o editar
  openDialog(producto?: Producto): void {
    const dialogRef = this.dialog.open(ProductosDialog, {
      width: '600px',
      data: producto ? { ...producto } : {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.idProducto) {
          // Actualizar producto existente
          this.productoService.actualizarProducto(result.idProducto, result).subscribe({
            next: () => this.loadProductos(),
            error: (error) => console.error('Error actualizando producto:', error)
          });
        } else {
          // Crear nuevo producto
          this.productoService.crearProducto(result).subscribe({
            next: () => this.loadProductos(),
            error: (error) => console.error('Error creando producto:', error)
          });
        }
      }
    });
  }

  // Retorna clase CSS según estado
  getEstadoClass(estado: string): string {
    return estado === 'ACTIVO' ? 'estado-activo' : 'estado-inactivo';
  }

  // Formatea el precio con separadores de miles
  formatPrecio(precio: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  }
}
