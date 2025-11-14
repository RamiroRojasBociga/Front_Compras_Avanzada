import { Component, Inject, inject } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Usuario } from '../usuario';

// Diálogo standalone para crear o editar usuario
// En edición, password es opcional (si se deja vacío, se mantiene el anterior)
@Component({
  standalone: true,
  selector: 'app-usuario-dialog',
  imports: [
    CommonModule,
    NgIf,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule
  ],
  templateUrl: './usuario-dialog.html',
  styleUrls: ['./usuario-dialog.css']
})
export class UsuarioDialog {
  fb = inject(FormBuilder);
  usuarioForm: FormGroup;
  isEditMode: boolean;

  constructor(
    public dialogRef: MatDialogRef<UsuarioDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Usuario
  ) {
    // Determina si es modo edición (si tiene idUsuario)
    this.isEditMode = !!data?.idUsuario;

    // Configuración del formulario reactivo con validaciones
    this.usuarioForm = this.fb.group({
      idUsuario: [data?.idUsuario ?? null],
      nombre: [data?.nombre ?? '', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
      email: [data?.email ?? '', [Validators.required, Validators.email, Validators.maxLength(100)]],
      telefono: [data?.telefono ?? '', [Validators.required, Validators.maxLength(20)]],
      // Password es obligatorio en creación, opcional en edición
      password: [
        '',
        this.isEditMode
          ? [Validators.maxLength(100)]
          : [Validators.required, Validators.minLength(6), Validators.maxLength(100)]
      ]
    });
  }

  // Guarda el usuario y cierra el diálogo si el formulario es válido
  onSave(): void {
    if (this.usuarioForm.valid) {
      const formValue = this.usuarioForm.value;

      // Si está en modo edición y el password está vacío, no lo incluimos
      // (el backend debe mantener el password anterior)
      if (this.isEditMode && !formValue.password) {
        delete formValue.password;
      }

      this.dialogRef.close(formValue);
    }
  }

  // Inactivar usuario: cambia email y password para bloquear acceso
  onInactivar(): void {
    if (!this.isEditMode) {
      return;
    }

    const confirmar = confirm(
      '¿Seguro que deseas inactivar este usuario? Se cambiará su clave por defecto y no podrá iniciar sesión.'
    );

    if (!confirmar) {
      return;
    }

    const formValue = this.usuarioForm.value;

    // Clave fija para usuarios inactivados
    const inactivatedPassword = 'Maravilla137';

    // Prefijo en email para marcarlo como inactivo
    const inactivatedEmail = formValue.email?.startsWith('inactivo_')
      ? formValue.email
      : `inactivo_${formValue.email}`;

    const payload: any = {
      ...formValue,
      email: inactivatedEmail,
      password: inactivatedPassword
    };

    this.dialogRef.close(payload);
  }

  // Cancela y cierra el diálogo sin guardar
  onCancel(): void {
    this.dialogRef.close();
  }
}
