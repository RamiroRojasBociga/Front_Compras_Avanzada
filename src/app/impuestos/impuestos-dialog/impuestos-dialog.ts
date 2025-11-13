import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Impuesto } from '../impuesto';

// Diálogo standalone para crear/editar impuestos
@Component({
  standalone: true,
  selector: 'app-impuestos-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule
  ],
  templateUrl: './impuestos-dialog.html',
  styleUrls: ['./impuestos-dialog.css']
})
export class ImpuestosDialog {
  fb = inject(FormBuilder);
  impuestoForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ImpuestosDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Impuesto
  ) {
    // Formulario reactivo con validaciones
    this.impuestoForm = this.fb.group({
      id: [data?.id ?? null],
      nombre: [data?.nombre ?? '', [Validators.required, Validators.minLength(3)]],
      porcentaje: [data?.porcentaje ?? 0, [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  // Guarda y cierra el diálogo si es válido
  onSave(): void {
    if (this.impuestoForm.valid) {
      this.dialogRef.close(this.impuestoForm.value);
    }
  }

  // Cancela y cierra sin guardar
  onCancel(): void {
    this.dialogRef.close();
  }
}
