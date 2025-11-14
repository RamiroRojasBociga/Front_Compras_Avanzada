// compras.ts
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
        console.log('Compras recibidas:', compras);
        this.dataSource.data = compras;
      },
      error: (error: any) => console.error('Error cargando compras:', error)
    });
  }

  openDialog(compra?: Compra): void {

    const compraData = compra
      ? {
          ...compra,
          idUsuario: +compra.idUsuario,
          idProveedor: +compra.idProveedor,
          fecha: compra.fecha
        }
      : {};

    const dialogRef = this.dialog.open(ComprasDialog, {
      width: '1280px',
      maxWidth: '99vw',
      maxHeight: '95vh',
      autoFocus: false,
      data: compraData
    });

    dialogRef.afterClosed().subscribe((result: { recargar: boolean } | undefined) => {
      if (result && result.recargar) {
        this.loadCompras();   // solo recargamos, no volvemos a guardar
      }
    });
  }

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

  formatFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }
}
