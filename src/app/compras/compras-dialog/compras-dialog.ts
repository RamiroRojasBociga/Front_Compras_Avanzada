import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { Compra, DetalleCompra } from '../compra';
import { ProductoService, Producto } from '../../productos/producto';
import { ProveedorService, Proveedor } from '../../proveedores/proveedor';
import { UsuarioService, Usuario } from '../../usuarios/usuario';

@Component({
  standalone: true,
  selector: 'app-compras-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatIconModule
  ],
  templateUrl: './compras-dialog.html',
  styleUrls: ['./compras-dialog.css']
})
export class ComprasDialog implements OnInit {
  fb = inject(FormBuilder);
  productoService = inject(ProductoService);
  proveedorService = inject(ProveedorService);
  usuarioService = inject(UsuarioService);

  compraForm: FormGroup;
  productos: Producto[] = [];
  proveedores: Proveedor[] = [];
  usuarios: Usuario[] = [];

  estados = [
    { value: 'PENDIENTE', label: 'Pendiente' },
    { value: 'PROCESADA', label: 'Procesada' },
    { value: 'ENTREGADA', label: 'Entregada' },
    { value: 'FACTURADA', label: 'Facturada' },
    { value: 'ANULADA', label: 'Anulada' }
  ];

  get detalles(): FormArray<FormGroup> {
    return this.compraForm.get('detalles') as FormArray<FormGroup>;
  }

  constructor(
    public dialogRef: MatDialogRef<ComprasDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Compra & { detalles?: DetalleCompra[] }
  ) {
    this.compraForm = this.fb.group({
      idCompra: [data?.idCompra ?? null],
      idUsuario: [data?.idUsuario ?? null, [Validators.required]],
      idProveedor: [data?.idProveedor ?? null, [Validators.required]],
      fecha: [data?.fecha ? new Date(data.fecha) : new Date(), [Validators.required]],
      estado: [data?.estado ?? 'PENDIENTE', [Validators.required]],
      detalles: this.fb.array([])
    });

    if (data?.detalles && data.detalles.length > 0) {
      data.detalles.forEach(det => {
        this.detalles.push(this.fb.group({
          idProducto: [det.idProducto, Validators.required],
          cantidad: [det.cantidad, [Validators.required, Validators.min(1)]]
        }));
      });
    }
  }

  ngOnInit(): void {
    this.loadCatalogos();
  }

  loadCatalogos() {
    this.productoService.getProductos().subscribe({
      next: (productos) => { this.productos = productos; },
      error: (error) => console.error('Error productos:', error)
    });
    this.proveedorService.getProveedores().subscribe({
      next: (proveedores) => { this.proveedores = proveedores; },
      error: (error) => console.error('Error proveedores:', error)
    });
    this.usuarioService.getUsuarios().subscribe({
      next: (usuarios) => { this.usuarios = usuarios; },
      error: (error) => console.error('Error usuarios:', error)
    });
  }

  nuevaLineaDetalle(): FormGroup {
    return this.fb.group({
      idProducto: [null, Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]]
    });
  }

  agregarDetalle() {
    this.detalles.push(this.nuevaLineaDetalle());
  }

  eliminarDetalle(index: number) {
    this.detalles.removeAt(index);
  }

  // ----- CORRECCIÓN FECHA -----
  onSave(): void {
    if (this.compraForm.valid && this.detalles.length > 0) {
      const formValue = { ...this.compraForm.value };
      // Fuerza a YYYY-MM-DD
      if (formValue.fecha instanceof Date && !isNaN(formValue.fecha.getTime())) {
        const year = formValue.fecha.getFullYear();
        const month = String(formValue.fecha.getMonth() + 1).padStart(2, '0');
        const day = String(formValue.fecha.getDate()).padStart(2, '0');
        formValue.fecha = `${year}-${month}-${day}`;
      } else if (typeof formValue.fecha === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(formValue.fecha)) {
        // dd/MM/yyyy --> yyyy-MM-dd
        const [day, month, year] = formValue.fecha.split('/');
        formValue.fecha = `${year}-${month}-${day}`;
      } else {
        // Si no se reconoce el formato, usa la fecha actual segura
        formValue.fecha = new Date().toISOString().split('T')[0];
      }
      this.dialogRef.close(formValue);
    }
  }
  // ----------------------------

  onCancel(): void {
    this.dialogRef.close();
  }
}
