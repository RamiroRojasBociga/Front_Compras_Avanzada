import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Categoria, CategoriaService } from './categoria';
import { CategoriaDialog } from './categoria-dialog/categoria-dialog';
import { PageToolbar } from '../shared/page-toolbar/page-toolbar';

// Componente standalone para gestión CRUD de categorías
@Component({
  standalone: true,
  selector: 'app-categorias',
  providers: [CategoriaService],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
    CategoriaDialog,
    PageToolbar  // ← DEBE estar aquí
  ],
  templateUrl: './categorias.html',
  styleUrls: ['./categorias.css']
})
export class Categorias implements OnInit {
  displayedColumns = ['id', 'nombre', 'acciones'];
  dataSource = new MatTableDataSource<Categoria>();

  private categoriaService = inject(CategoriaService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.loadCategorias();
  }

  // Obtiene todas las categorías del backend
  loadCategorias(): void {
    this.categoriaService.getCategorias().subscribe({
      next: categorias => this.dataSource.data = categorias,
      error: error => console.error('Error al cargar categorías:', error)
    });
  }

  // Abre el dialog de crear o editar categoría
  openDialog(categoria?: Categoria): void {
    const dialogRef = this.dialog.open(CategoriaDialog, {
      width: '430px',
      data: categoria ? { ...categoria } : {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.categoriaService.actualizarCategoria(result.id, result).subscribe({
            next: () => this.loadCategorias(),
            error: error => console.error('Error al actualizar categoría:', error)
          });
        } else {
          this.categoriaService.crearCategoria({ nombre: result.nombre }).subscribe({
            next: () => this.loadCategorias(),
            error: error => console.error('Error al crear categoría:', error)
          });
        }
      }
    });
  }

  // Elimina una categoría con confirmación previa
  deleteCategoria(id?: number): void {
    if (id && confirm('¿Estás seguro de eliminar esta categoría?')) {
      this.categoriaService.eliminarCategoria(id).subscribe({
        next: () => this.loadCategorias(),
        error: error => console.error('Error al eliminar categoría:', error)
      });
    }
  }
}
