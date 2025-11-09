import { Routes } from '@angular/router';

import { Login} from './login/login';
import { Categorias } from './categorias/categorias';
import { Marcas } from './marcas/marcas';
import { Ciudades } from './ciudades/ciudades';
import { Usuarios } from './usuarios/usuarios';

export const routes: Routes = [
  {
    path: 'login',                // Ruta para login
    component: Login
  },
  {
    path: 'categorias',           // Ruta para categorías
    component: Categorias
  },
  {
    path: 'marcas',               // Ruta para marcas
    component: Marcas
  },
  {
    path: 'ciudades',               // Ruta para ciudades
    component: Ciudades
  },
  {
    path: 'usuarios',               // Ruta para usuarios
    component: Usuarios
  },
  {
    path: '',                     // Ruta raíz
    redirectTo: '/login',         // Redirección por defecto
    pathMatch: 'full'
  },
  {
    path: '**',                   // Ruta comodín
    redirectTo: '/login'          // Redirección para rutas no encontradas
  }
];
