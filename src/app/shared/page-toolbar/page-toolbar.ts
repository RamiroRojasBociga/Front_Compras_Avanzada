import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-page-toolbar',
  standalone: true,  // DEBE estar presente
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './page-toolbar.html',
  styleUrls: ['./page-toolbar.css']
})
export class PageToolbar {  // DEBE tener 'export'
  @Input() pageTitle: string = '';
  @Input() showActionButton: boolean = true;
  @Input() actionButtonText: string = 'Crear';
  @Input() actionIcon: string = 'add';
  @Output() actionClick = new EventEmitter<void>();

  constructor(private router: Router) {}

  goBackToMenu(): void {
    this.router.navigate(['/menu']);
  }

  onAction(): void {
    this.actionClick.emit();
  }
}
