import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Marca } from '../marca';

@Component({
  standalone: true,
  selector: 'app-marca-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule
  ],
  templateUrl: './marca-dialog.html',
  styleUrls: ['./marca-dialog.css']
})
export class MarcaDialog {
  fb = inject(FormBuilder);

  marcaForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<MarcaDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Marca
  ) {
    this.marcaForm = this.fb.group({
      id: [data?.id ?? null],
      nombre: [data?.nombre ?? '', [Validators.required, Validators.minLength(3)]]
    });
  }

  onSave() {
    if (this.marcaForm.valid) {
      this.dialogRef.close(this.marcaForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
