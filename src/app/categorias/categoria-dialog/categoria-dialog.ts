import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Categoria } from '../categoria';

// Diálogo standalone para crear o editar categoría
@Component({
  standalone: true,
  selector: 'app-categoria-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule
  ],
  templateUrl: './categoria-dialog.html',
  styleUrls: ['./categoria-dialog.css']
})
export class CategoriaDialog {
  fb = inject(FormBuilder);

  categoriaForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CategoriaDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Categoria
  ) {
    this.categoriaForm = this.fb.group({
      id: [data?.id ?? null],
      nombre: [data?.nombre ?? '', [Validators.required, Validators.minLength(3)]]
    });
  }

  onSave(): void {
    if (this.categoriaForm.valid) {
      this.dialogRef.close(this.categoriaForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
