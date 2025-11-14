// compras-dialog.ts
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
import { CompraService, DetalleCompraService } from '../compra';

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
  compraService = inject(CompraService);
  detalleCompraService = inject(DetalleCompraService);

  compraForm: FormGroup;

  productos: Producto[] = [];
  proveedores: Proveedor[] = [];
  usuarios: Usuario[] = [];

  estados = [
    { value: 'PENDIENTE',  label: 'Pendiente' },
    { value: 'PROCESADA',  label: 'Procesada' },
    { value: 'ENTREGADA',  label: 'Entregada' },
    { value: 'FACTURADA',  label: 'Facturada' },
    { value: 'ANULADA',    label: 'Anulada' }
  ];

  // Lista de ids de detalles eliminados en la edición
  detallesEliminados: number[] = [];

  get detalles(): FormArray<FormGroup> {
    return this.compraForm.get('detalles') as FormArray<FormGroup>;
  }

  constructor(
    public dialogRef: MatDialogRef<ComprasDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Compra & { detalles?: DetalleCompra[] }
  ) {
    let fechaInicial = new Date();

    if (data?.fecha) {
      if (data.fecha.includes('-')) {
        const [year, month, day] = data.fecha.split('-').map(Number);
        fechaInicial = new Date(year, month - 1, day);
      } else if (data.fecha.includes('/')) {
        const [day, month, year] = data.fecha.split('/').map(Number);
        fechaInicial = new Date(year, month - 1, day);
      }
    }

    this.compraForm = this.fb.group({
      idCompra:    [data?.idCompra ?? null],
      idUsuario:   [data?.idUsuario ?? null, [Validators.required]],
      idProveedor: [data?.idProveedor ?? null, [Validators.required]],
      fecha:       [fechaInicial, [Validators.required]],
      estado:      [data?.estado ?? 'PENDIENTE', [Validators.required]],
      total:       [data?.total ?? 0],
      detalles:    this.fb.array([])
    });

    if (data?.detalles && data.detalles.length > 0) {
      this.detalles.clear();
      data.detalles.forEach(det => {
        const fg = this.crearDetalleConValores(det);
        this.detalles.push(fg);
      });
      this.recalcularTodo();
    }
  }

  ngOnInit(): void {
    this.loadCatalogos();

    if (this.data?.idCompra) {
      this.cargarDetallesCompra(this.data.idCompra);
    }
  }

  loadCatalogos() {
    this.productoService.getProductos().subscribe({
      next: (productos) => { this.productos = productos; },
      error: (error) => console.error('Error cargando productos:', error)
    });

    this.proveedorService.getProveedores().subscribe({
      next: (proveedores) => { this.proveedores = proveedores; },
      error: (error) => console.error('Error cargando proveedores:', error)
    });

    this.usuarioService.getUsuarios().subscribe({
      next: (usuarios) => { this.usuarios = usuarios; },
      error: (error) => console.error('Error cargando usuarios:', error)
    });
  }

  // Cargar detalles de una compra existente
  cargarDetallesCompra(idCompra: number) {
    this.detalleCompraService.getDetallesByCompraId(idCompra).subscribe({
      next: (detalles: DetalleCompra[]) => {
        this.detalles.clear();
        this.detallesEliminados = [];
        detalles.forEach(det => {
          const fg = this.crearDetalleConValores(det);
          this.detalles.push(fg);
        });
        this.recalcularTodo();
      },
      error: (error: any) => {
        console.error('Error cargando detalles de la compra:', error);
      }
    });
  }

  // Crea un detalle con valores desde el backend (incluye idDetalleCompra)
  crearDetalleConValores(det: DetalleCompra): FormGroup {
    const detalle = this.fb.group({
      idDetalleCompra: [det.idDetalleCompra ?? null],                      // nuevo
      idProducto:      [det.idProducto, Validators.required],
      cantidad:        [det.cantidad ?? 1, [Validators.required, Validators.min(1)]],
      precioUnitario:  [det.precioUnitario ?? 0, [Validators.required, Validators.min(0)]],
      subtotal:        [{ value: 0, disabled: true }]
    });

    this.subscribeToChanges(detalle);
    this.calcularSubtotal(detalle);

    return detalle;
  }

  // Crea un detalle nuevo vacío (sin idDetalleCompra)
  nuevaLineaDetalle(): FormGroup {
    const detalle = this.fb.group({
      idDetalleCompra: [null],
      idProducto:      [null, Validators.required],
      cantidad:        [1, [Validators.required, Validators.min(1)]],
      precioUnitario:  [0, [Validators.required, Validators.min(0)]],
      subtotal:        [{ value: 0, disabled: true }]
    });

    this.subscribeToChanges(detalle);
    this.calcularSubtotal(detalle);

    return detalle;
  }

  subscribeToChanges(detalle: FormGroup): void {
    detalle.get('cantidad')?.valueChanges.subscribe(() => {
      this.calcularSubtotal(detalle);
    });

    detalle.get('precioUnitario')?.valueChanges.subscribe(() => {
      this.calcularSubtotal(detalle);
    });

    detalle.get('idProducto')?.valueChanges.subscribe((idProducto) => {
      this.onProductoChange(detalle, idProducto);
    });
  }

  onProductoChange(detalle: FormGroup, idProducto: number): void {
    const producto = this.productos.find(p => p.idProducto === idProducto);
    if (producto && producto.precio != null) {
      detalle.get('precioUnitario')?.setValue(producto.precio);
    }
  }

  calcularSubtotal(detalle: FormGroup): void {
    const cantidad = Number(detalle.get('cantidad')?.value) || 0;
    const precio   = Number(detalle.get('precioUnitario')?.value) || 0;
    const subtotal = cantidad * precio;

    detalle.get('subtotal')?.setValue(subtotal, { emitEvent: false });
    this.calcularTotal();
  }

  calcularTotal(): number {
    let total = 0;
    this.detalles.controls.forEach(detalle => {
      const sub = Number(detalle.get('subtotal')?.value) || 0;
      total += sub;
    });
    this.compraForm.get('total')?.setValue(total, { emitEvent: false });
    return total;
  }

  recalcularTodo(): void {
    this.detalles.controls.forEach(det => this.calcularSubtotal(det));
    this.calcularTotal();
  }

  get totalCompra(): number {
    return this.compraForm.get('total')?.value || 0;
  }

  agregarDetalle() {
    this.detalles.push(this.nuevaLineaDetalle());
    this.calcularTotal();
  }

  // Registrar eliminados y quitar del FormArray
  eliminarDetalle(index: number) {
    const grupo = this.detalles.at(index) as FormGroup;
    const idDetalle = grupo.get('idDetalleCompra')?.value as number | null;

    if (idDetalle) {
      this.detallesEliminados.push(idDetalle);
    }

    this.detalles.removeAt(index);
    this.calcularTotal();
  }

  // Guardar compra + detalles (nuevos) + eliminar detalles borrados
  async onSave(): Promise<void> {
    if (this.compraForm.valid && this.detalles.length > 0) {
      const formValue = { ...this.compraForm.getRawValue() };

      if (formValue.fecha instanceof Date) {
        const year  = formValue.fecha.getFullYear();
        const month = String(formValue.fecha.getMonth() + 1).padStart(2, '0');
        const day   = String(formValue.fecha.getDate()).padStart(2, '0');
        formValue.fecha = `${year}-${month}-${day}`;
      }

      formValue.total = this.calcularTotal();

      const detallesParaGuardar = [...formValue.detalles];
      delete formValue.detalles;

      console.log('Enviando compra principal:', formValue);
      console.log('Detalles a guardar:', detallesParaGuardar);
      console.log('Detalles eliminados:', this.detallesEliminados);

      try {
        let compraGuardada;

        if (formValue.idCompra) {
          compraGuardada = await this.compraService.actualizarCompra(formValue.idCompra, formValue).toPromise();
        } else {
          compraGuardada = await this.compraService.crearCompra(formValue).toPromise();
        }

        if (compraGuardada && compraGuardada.idCompra) {

          // 1. Eliminar detalles que el usuario quitó
          for (const idDetalle of this.detallesEliminados) {
            await this.detalleCompraService.eliminarDetalle(idDetalle).toPromise();
          }

          // 2. Crear o actualizar los detalles actuales
          for (const detalle of detallesParaGuardar) {
            const idDetalle = detalle.idDetalleCompra as number | undefined;

            const cuerpoDetalle = {
              idCompra:   compraGuardada.idCompra,
              idProducto: detalle.idProducto,
              cantidad:   detalle.cantidad
            };

            if (idDetalle) {
              await this.detalleCompraService.actualizarDetalle(idDetalle, cuerpoDetalle).toPromise();
            } else {
              await this.detalleCompraService.crearDetalle(cuerpoDetalle).toPromise();
            }
          }
        }

        console.log('Compra y detalles procesados correctamente');
        this.dialogRef.close({ recargar: true });

      } catch (error) {
        console.error('Error guardando compra:', error);
        alert('Error al guardar la compra');
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close({ recargar: false });
  }
}
