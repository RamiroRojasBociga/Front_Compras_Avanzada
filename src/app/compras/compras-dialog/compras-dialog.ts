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
import { CompraService } from '../compra';
import { DetalleCompraService } from '../compra';

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
  // Inyección de dependencias
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

  // Definición de estados disponibles para las compras
  estados = [
    { value: 'PENDIENTE', label: 'Pendiente' },
    { value: 'PROCESADA', label: 'Procesada' },
    { value: 'ENTREGADA', label: 'Entregada' },
    { value: 'FACTURADA', label: 'Facturada' },
    { value: 'ANULADA', label: 'Anulada' }
  ];

  // Getter para acceder fácilmente al FormArray de detalles
  get detalles(): FormArray<FormGroup> {
    return this.compraForm.get('detalles') as FormArray<FormGroup>;
  }

  constructor(
    public dialogRef: MatDialogRef<ComprasDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Compra & { detalles?: DetalleCompra[] }
  ) {
    // Inicialización del formulario con datos existentes o valores por defecto
    let fechaInicial = new Date();
    if (data?.fecha) {
      // Parseo de fecha desde diferentes formatos
      if (data.fecha.includes('-')) {
        const [year, month, day] = data.fecha.split('-').map(Number);
        fechaInicial = new Date(year, month - 1, day);
      }
      else if (data.fecha.includes('/')) {
        const [day, month, year] = data.fecha.split('/').map(Number);
        fechaInicial = new Date(year, month - 1, day);
      }
    }

    this.compraForm = this.fb.group({
      idCompra: [data?.idCompra ?? null],
      idUsuario: [data?.idUsuario ?? null, [Validators.required]],
      idProveedor: [data?.idProveedor ?? null, [Validators.required]],
      fecha: [fechaInicial, [Validators.required]],
      estado: [data?.estado ?? 'PENDIENTE', [Validators.required]],
      total: [data?.total ?? 0],
      detalles: this.fb.array([])
    });

    // Carga los detalles existentes si se está editando una compra
    if (data?.detalles && data.detalles.length > 0) {
      data.detalles.forEach(det => {
        this.detalles.push(this.crearDetalleConValores(det));
      });
      // Calcula el total inicial con los detalles cargados
      setTimeout(() => this.calcularTotal(), 100);
    }
  }

  ngOnInit(): void {
    this.loadCatalogos();
  }

  // Carga los catálogos necesarios para los selectores
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

  // Crea un FormGroup para un detalle con valores existentes
  crearDetalleConValores(det: DetalleCompra): FormGroup {
    const detalle = this.fb.group({
      idProducto: [det.idProducto, Validators.required],
      cantidad: [det.cantidad, [Validators.required, Validators.min(1)]],
      precioUnitario: [det.precioUnitario || 0, [Validators.required, Validators.min(0)]],
      subtotal: [{ value: det.subtotal || 0, disabled: true }]
    });

    this.subscribeToChanges(detalle);
    return detalle;
  }

  // Crea un FormGroup para un nuevo detalle vacío
  nuevaLineaDetalle(): FormGroup {
    const detalle = this.fb.group({
      idProducto: [null, Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precioUnitario: [0, [Validators.required, Validators.min(0)]],
      subtotal: [{ value: 0, disabled: true }]
    });

    this.subscribeToChanges(detalle);
    return detalle;
  }

  // Suscribe a los cambios en los campos del detalle para cálculos automáticos
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

  // Cuando cambia el producto, actualiza el precio unitario automáticamente
  onProductoChange(detalle: FormGroup, idProducto: number): void {
    const producto = this.productos.find(p => p.idProducto === idProducto);
    if (producto && producto.precio) {
      detalle.get('precioUnitario')?.setValue(producto.precio);
    }
  }

  // Calcula el subtotal para un detalle específico
  calcularSubtotal(detalle: FormGroup): void {
    const cantidad = detalle.get('cantidad')?.value || 0;
    const precio = detalle.get('precioUnitario')?.value || 0;
    const subtotal = cantidad * precio;
    
    detalle.get('subtotal')?.setValue(subtotal, { emitEvent: false });
    this.calcularTotal();
  }

  // Calcula el total de toda la compra sumando todos los subtotales
  calcularTotal(): number {
    let total = 0;
    this.detalles.controls.forEach(detalle => {
      total += detalle.get('subtotal')?.value || 0;
    });
    this.compraForm.get('total')?.setValue(total, { emitEvent: false });
    return total;
  }

  // Getter para el total de la compra (usado en el template)
  get totalCompra(): number {
    return this.calcularTotal();
  }

  // Agrega una nueva línea de detalle a la compra
  agregarDetalle() {
    this.detalles.push(this.nuevaLineaDetalle());
  }

  // Elimina una línea de detalle específica
  eliminarDetalle(index: number) {
    this.detalles.removeAt(index);
    this.calcularTotal();
  }

  // Método principal para guardar la compra y sus detalles
  async onSave(): Promise<void> {
    if (this.compraForm.valid && this.detalles.length > 0) {
      const formValue = { ...this.compraForm.getRawValue() };

      // Convierte fecha a formato YYYY-MM-DD (ISO) para el backend
      if (formValue.fecha instanceof Date) {
        const year = formValue.fecha.getFullYear();
        const month = String(formValue.fecha.getMonth() + 1).padStart(2, '0');
        const day = String(formValue.fecha.getDate()).padStart(2, '0');
        formValue.fecha = `${year}-${month}-${day}`;
      }

      formValue.total = this.calcularTotal();

      // Separa los detalles del objeto principal para guardarlos por separado
      const detallesParaGuardar = [...formValue.detalles];
      delete formValue.detalles;

      console.log('Enviando compra principal:', formValue);
      console.log('Detalles a guardar:', detallesParaGuardar);
      
      try {
        // 1. Guardar compra principal
        let compraGuardada;
        if (formValue.idCompra) {
          compraGuardada = await this.compraService.actualizarCompra(formValue.idCompra, formValue).toPromise();
        } else {
          compraGuardada = await this.compraService.crearCompra(formValue).toPromise();
        }

        // 2. Guardar cada detalle por separado
        if (compraGuardada && compraGuardada.idCompra) {
          for (const detalle of detallesParaGuardar) {
            const detalleParaGuardar = {
              idCompra: compraGuardada.idCompra,
              idProducto: detalle.idProducto,
              cantidad: detalle.cantidad
            };
            
            await this.detalleCompraService.crearDetalle(detalleParaGuardar).toPromise();
          }
        }

        console.log('Compra y detalles guardados exitosamente');
        this.dialogRef.close(true);
        
      } catch (error) {
        console.error('Error guardando compra:', error);
        alert('Error al guardar la compra');
      }
    }
  }

  // Cierra el diálogo sin guardar cambios
  onCancel(): void {
    this.dialogRef.close();
  }
}