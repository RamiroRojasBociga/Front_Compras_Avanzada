import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { Proveedor } from '../proveedor';
import { CiudadService, Ciudad } from '../../ciudades/ciudad';

// Diálogo standalone para crear/editar proveedores
@Component({
  standalone: true,
  selector: 'app-proveedores-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatIconModule
  ],
  templateUrl: './proveedores-dialog.html',
  styleUrls: ['./proveedores-dialog.css']
})
export class ProveedoresDialog implements OnInit {
  fb = inject(FormBuilder);
  ciudadService = inject(CiudadService);
  proveedorForm: FormGroup;
  ciudades: Ciudad[] = [];

  constructor(
    public dialogRef: MatDialogRef<ProveedoresDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Proveedor
  ) {
    // Formulario reactivo con validaciones
    this.proveedorForm = this.fb.group({
      idProveedor: [data?.idProveedor ?? null],
      nombre: [data?.nombre ?? '', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
      idCiudad: [data?.idCiudad ?? null, [Validators.required]],
      direccion: [data?.direccion ?? '', [Validators.required, Validators.maxLength(150)]],
      email: [data?.email ?? '', [Validators.required, Validators.email, Validators.maxLength(100)]],
      estado: [data?.estado ?? 'ACTIVO', [Validators.required]],
      telefonos: this.fb.array(
        data?.telefonos?.length ? data.telefonos.map(tel => this.fb.control(tel, [Validators.required])) : [this.fb.control('', [Validators.required])]
      )
    });
  }

  // Carga catálogo de ciudades al inicializar
  ngOnInit(): void {
    this.ciudadService.getCiudades().subscribe({
      next: (ciudades) => this.ciudades = ciudades,
      error: (error) => console.error('Error cargando ciudades:', error)
    });
  }

  // Getter para acceder al FormArray de teléfonos
  get telefonos(): FormArray {
    return this.proveedorForm.get('telefonos') as FormArray;
  }

  // Agrega un nuevo campo de teléfono
  addTelefono(): void {
    this.telefonos.push(this.fb.control('', [Validators.required]));
  }

  // Elimina un campo de teléfono
  removeTelefono(index: number): void {
    if (this.telefonos.length > 1) {
      this.telefonos.removeAt(index);
    }
  }

  // Guarda y cierra el diálogo si es válido
  onSave(): void {
    if (this.proveedorForm.valid) {
      this.dialogRef.close(this.proveedorForm.value);
    }
  }

  // Cancela y cierra el diálogo
  onCancel(): void {
    this.dialogRef.close();
  }
}
