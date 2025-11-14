// compras.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

// Servicios y modelos
import { Compra, CompraService } from './compra';
import { ComprasDialog } from './compras-dialog/compras-dialog';
import { PageToolbar } from '../shared/page-toolbar/page-toolbar';

@Component({
  standalone: true,
  selector: 'app-compras',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    PageToolbar,
    MatTooltipModule
  ],
  templateUrl: './compras.html',
  styleUrls: ['./compras.css']
})
export class Compras implements OnInit {

  // Columnas de la tabla de compras
  displayedColumns = ['idCompra', 'numFactura', 'fecha', 'nombreProveedor', 'nombreUsuario', 'estado', 'acciones'];

  // DataSource para la tabla de Angular Material
  dataSource = new MatTableDataSource<Compra>();

  // Inyección de servicios
  private compraService = inject(CompraService);
  private dialog = inject(MatDialog);

  // Ciclo de vida - carga inicial de compras
  ngOnInit(): void {
    this.loadCompras();
  }

  // Cargar todas las compras desde el backend
  loadCompras(): void {
    this.compraService.getCompras().subscribe({
      next: (compras: Compra[]) => {
        console.log('✅ Compras recibidas:', compras);
        this.dataSource.data = compras;
      },
      error: (error: any) => console.error('❌ Error cargando compras:', error)
    });
  }

  // Apertura del diálogo de creación / edición de compras
  openDialog(compra?: Compra): void {

    // Normalizamos los datos que se envían al diálogo
    const compraData = compra
      ? {
          ...compra,
          idUsuario: +compra.idUsuario,
          idProveedor: +compra.idProveedor,
          fecha: compra.fecha
        }
      : {};

    // 🔹 Configuración de tamaño del diálogo
    // - width: hace el cuadro más ancho en pantallas grandes
    // - maxWidth: limita el ancho máximo relativo a la pantalla (responsive)
    // - maxHeight: permite que el contenido crezca alto con scroll interno
    const dialogRef = this.dialog.open(ComprasDialog, {
      width: '980px',      // Más ancho para escritorio
      maxWidth: '96vw',    // Nunca ocupa más del 96% del ancho de la ventana
      maxHeight: '94vh',   // Permite buena altura con scroll interno
      autoFocus: false,    // Evita que el foco mueva la vista automáticamente
      data: compraData,
      panelClass: 'compra-dialog-panel' // Clase extra para afinar estilos globales si se requiere
    });

    // Manejo del resultado al cerrar el diálogo
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (result.idCompra) {
          this.compraService.actualizarCompra(result.idCompra, result).subscribe({
            next: () => this.loadCompras(),
            error: (error: any) => console.error('Error actualizando compra:', error)
          });
        } else {
          this.compraService.crearCompra(result).subscribe({
            next: () => this.loadCompras(),
            error: (error: any) => console.error('Error creando compra:', error)
          });
        }
      }
    });
  }

  // Devuelve la clase CSS para mostrar el chip de estado
  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'PENDIENTE': return 'estado-pendiente';
      case 'PROCESADA': return 'estado-procesada';
      case 'ENTREGADA': return 'estado-entregada';
      case 'FACTURADA': return 'estado-facturada';
      case 'ANULADA': return 'estado-anulada';
      default: return '';
    }
  }

  // Formatea la fecha al formato deseado para la tabla
  formatFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }
}
