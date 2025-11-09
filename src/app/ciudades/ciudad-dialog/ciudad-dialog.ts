import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Ciudad } from '../ciudad';

// Diálogo standalone para creación/edición de ciudad
@Component({
  standalone: true,
  selector: 'app-ciudad-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule
  ],
  templateUrl: './ciudad-dialog.html',
  styleUrls: ['./ciudad-dialog.css']
})
export class CiudadDialog {
  fb = inject(FormBuilder);
  ciudadForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CiudadDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Ciudad
  ) {
    this.ciudadForm = this.fb.group({
      id: [data?.id ?? null],
      nombre: [data?.nombre ?? '', [Validators.required, Validators.minLength(3)]]
    });
  }

  // Cierra dialog retornando datos si son válidos
  onSave(): void {
    if (this.ciudadForm.valid) {
      this.dialogRef.close(this.ciudadForm.value);
    }
  }

  // Cierra dialog sin guardar
  onCancel(): void {
    this.dialogRef.close();
  }
}
