import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

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
  displayedColumns = ['idCompra', 'numFactura', 'fecha', 'nombreProveedor', 'nombreUsuario', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<Compra>();
  private compraService = inject(CompraService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.loadCompras();
  }

  loadCompras(): void {
    this.compraService.getCompras().subscribe({
      next: (compras: Compra[]) => {
        console.log('✅ Compras recibidas:', compras);
        this.dataSource.data = compras;
      },
      error: (error: any) => console.error('❌ Error cargando compras:', error)
    });
  }

  openDialog(compra?: Compra): void {
  // Nos aseguramos de pasar sólo los valores requeridos (IDs y fecha)
  const compraData = compra
    ? {
        ...compra,
        idUsuario: +compra.idUsuario,
        idProveedor: +compra.idProveedor,
        fecha: compra.fecha
      }
    : {};

  // <-- AQUÍ AJUSTA EL WIDTH Y EL MAXWIDTH
  const dialogRef = this.dialog.open(ComprasDialog, {
    width: '800px',         // cambia a 880px o 900px si quieres más ancho
    maxWidth: '98vw',       // garantiza responsividad, nunca se sale del viewport
    data: compraData
  });

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


  getEstadoClass(estado: string): string {
    switch(estado) {
      case 'PENDIENTE': return 'estado-pendiente';
      case 'PROCESADA': return 'estado-procesada';
      case 'ENTREGADA': return 'estado-entregada';
      case 'FACTURADA': return 'estado-facturada';
      case 'ANULADA': return 'estado-anulada';
      default: return '';
    }
  }

  formatFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-CO', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
  }
}
