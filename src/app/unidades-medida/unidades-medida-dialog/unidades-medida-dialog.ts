import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

// Importa la interfaz UnidadMedida desde el archivo padre
import { UnidadMedida } from '../unidad-medida';

/**
 * Componente standalone para el diálogo de crear/editar Unidad de Medida.
 * Usa Angular Material Dialog y formularios reactivos.
 */
@Component({
  standalone: true,
  selector: 'app-unidades-medida-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule
  ],
  templateUrl: './unidades-medida-dialog.html',
  styleUrls: ['./unidades-medida-dialog.css']
})
export class UnidadesMedidaDialog {
  // FormBuilder inyectado para crear formularios reactivos
  fb = inject(FormBuilder);

  // FormGroup que maneja los datos del formulario
  unidadForm: FormGroup;

  /**
   * Constructor del diálogo
   * @param dialogRef Referencia al diálogo actual
   * @param data Datos iniciales (vacío para crear, con datos para editar)
   */
  constructor(
    public dialogRef: MatDialogRef<UnidadesMedidaDialog>,
    @Inject(MAT_DIALOG_DATA) public data: UnidadMedida
  ) {
    // Inicializa el formulario con validaciones
    this.unidadForm = this.fb.group({
      id: [data?.id ?? null],
      nombre: [data?.nombre ?? '', [Validators.required, Validators.minLength(3)]]
    });
  }

  /**
   * Guarda los cambios si el formulario es válido
   * Cierra el diálogo retornando los datos del formulario
   */
  onSave(): void {
    if (this.unidadForm.valid) {
      this.dialogRef.close(this.unidadForm.value);
    }
  }

  /**
   * Cancela la operación y cierra el diálogo sin guardar
   */
  onCancel(): void {
    this.dialogRef.close();
  }
}
