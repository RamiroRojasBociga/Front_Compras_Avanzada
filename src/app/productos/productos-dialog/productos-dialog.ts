import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Producto } from '../producto';
import { CategoriaService, Categoria } from '../../categorias/categoria';
import { MarcaService, Marca } from '../../marcas/marca';
import { UnidadMedidaService, UnidadMedida } from '../../unidades-medida/unidad-medida';
import { ImpuestoService, Impuesto } from '../../impuestos/impuesto';

// Diálogo standalone para crear/editar productos
@Component({
  standalone: true,
  selector: 'app-productos-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule
  ],
  templateUrl: './productos-dialog.html',
  styleUrls: ['./productos-dialog.css']
})
export class ProductosDialog implements OnInit {
  fb = inject(FormBuilder);
  categoriaService = inject(CategoriaService);
  marcaService = inject(MarcaService);
  unidadMedidaService = inject(UnidadMedidaService);
  impuestoService = inject(ImpuestoService);
  
  productoForm: FormGroup;
  categorias: Categoria[] = [];
  marcas: Marca[] = [];
  unidadesMedida: UnidadMedida[] = [];
  impuestos: Impuesto[] = [];

  constructor(
    public dialogRef: MatDialogRef<ProductosDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Producto
  ) {
    // Formulario reactivo con validaciones
    this.productoForm = this.fb.group({
      idProducto: [data?.idProducto ?? null],
      nombre: [data?.nombre ?? '', [Validators.required, Validators.minLength(3)]],
      idCategoria: [data?.idCategoria ?? null, [Validators.required]],
      idMarca: [data?.idMarca ?? null, [Validators.required]],
      idUnidadMedida: [data?.idUnidadMedida ?? null, [Validators.required]],
      cantidadUnidadesMedida: [data?.cantidadUnidadesMedida ?? 1, [Validators.required, Validators.min(1)]],
      idImpuesto: [data?.idImpuesto ?? null, [Validators.required]],
      precio: [data?.precio ?? 0, [Validators.required, Validators.min(0)]],
      stock: [data?.stock ?? 0, [Validators.required, Validators.min(0)]],
      estado: [data?.estado ?? 'ACTIVO', [Validators.required]],
      descripcion: [data?.descripcion ?? '']
    });
  }

  // Carga catálogos al inicializar
  ngOnInit(): void {
    this.loadCatalogos();
  }

  // Carga todos los catálogos necesarios
  loadCatalogos(): void {
    // Cargar categorías
    this.categoriaService.getCategorias().subscribe({
      next: (categorias: Categoria[]) => {
        this.categorias = categorias;
        console.log('Categorías cargadas:', categorias);
      },
      error: (error: any) => console.error('Error cargando categorías:', error)
    });

    // Cargar marcas
    this.marcaService.getMarcas().subscribe({
      next: (marcas: Marca[]) => {
        this.marcas = marcas;
        console.log('Marcas cargadas:', marcas);
      },
      error: (error: any) => console.error('Error cargando marcas:', error)
    });

    // Cargar unidades de medida
    this.unidadMedidaService.getUnidades().subscribe({
      next: (unidades: UnidadMedida[]) => {
        this.unidadesMedida = unidades;
        console.log('Unidades de medida cargadas:', unidades);
      },
      error: (error: any) => console.error('Error cargando unidades de medida:', error)
    });

    // Cargar impuestos
    this.impuestoService.getImpuestos().subscribe({
      next: (impuestos: Impuesto[]) => {
        this.impuestos = impuestos;
        console.log('Impuestos cargados:', impuestos);
      },
      error: (error: any) => console.error('Error cargando impuestos:', error)
    });
  }

  // Guarda y cierra el diálogo si es válido
  onSave(): void {
    if (this.productoForm.valid) {
      console.log('Producto a guardar:', this.productoForm.value);
      this.dialogRef.close(this.productoForm.value);
    } else {
      console.warn('Formulario inválido:', this.productoForm.errors);
    }
  }

  // Cancela y cierra el diálogo
  onCancel(): void {
    this.dialogRef.close();
  }
}
