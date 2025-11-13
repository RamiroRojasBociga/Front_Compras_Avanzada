import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';

/**
 * MenuPrincipal Component
 * Displays the main navigation menu after successful login
 * Provides access to all application modules through clickable cards
 */
@Component({
  selector: 'app-menu-principal',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatGridListModule
  ],
  templateUrl: './menu-principal.html',
  styleUrls: ['./menu-principal.css']
})
export class MenuPrincipal {
  
  /**
   * Array of menu options with navigation metadata
   * Each option contains: title, icon, route path, and description
   */
  menuOptions = [
    {
      title: 'Compras',
      icon: 'shopping_cart',
      route: '/compras',
      description: 'Gestión de compras y órdenes'
    },
    {
      title: 'Productos',
      icon: 'inventory_2',
      route: '/productos',
      description: 'Administrar productos'
    },
    {
      title: 'Categorías',
      icon: 'category',
      route: '/categorias',
      description: 'Categorías de productos'
    },
    {
      title: 'Marcas',
      icon: 'label',
      route: '/marcas',
      description: 'Gestión de marcas'
    },
    {
      title: 'Ciudades',
      icon: 'location_city',
      route: '/ciudades',
      description: 'Administrar ciudades'
    },
    {
      title: 'Usuarios',
      icon: 'people',
      route: '/usuarios',
      description: 'Gestión de usuarios'
    },
    {
      title: 'Unidades de Medida',
      icon: 'straighten',
      route: '/unidades-medida',
      description: 'Unidades de medida'
    },
    {
      title: 'Proveedores',
      icon: 'local_shipping',
      route: '/proveedores',
      description: 'Gestión de proveedores'
    },
    {
      title: 'Impuestos',
      icon: 'receipt_long',
      route: '/impuestos',
      description: 'Configurar impuestos'
    }
  ];

  constructor(private router: Router) {}

  /**
   * Navigate to the selected module
   * @param route - Target route path
   */
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  /**
   * Logout and return to login screen
   * Clears authentication and redirects to login page
   */
  logout(): void {
    // Aquí puedes agregar lógica para limpiar el token/sesión
    this.router.navigate(['/login']);
  }
}
