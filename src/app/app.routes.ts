import { Routes } from '@angular/router';

import { Login } from './login/login';
import { Categorias } from './categorias/categorias';
import { Marcas } from './marcas/marcas';
import { Ciudades } from './ciudades/ciudades';
import { Usuarios } from './usuarios/usuarios';
import { UnidadesMedida } from './unidades-medida/unidades-medida';
import { Impuestos } from './impuestos/impuestos'; 
import { Proveedores } from './proveedores/proveedores';
import { Productos } from './productos/productos';
import { Compras } from './compras/compras';
import { MenuPrincipal } from './menu-principal/menu-principal';

export const routes: Routes = [
  {
    path: 'login',
    component: Login
  },
  { path: 'menu', 
    component: MenuPrincipal 
  },

  {
  path: 'compras',
  component: Compras
  },

  {
    path: 'productos',
    component: Productos
  },
  {
    path: 'categorias',
    component: Categorias
  },
  {
    path: 'marcas',
    component: Marcas
  },
  {
    path: 'ciudades',
    component: Ciudades
  },
  {
    path: 'usuarios',
    component: Usuarios
  },
  {
    path: 'unidades-medida',
    component: UnidadesMedida
  },
  {
    path: 'proveedores',
    component: Proveedores
  },
  {
    path: 'impuestos',             
    component: Impuestos
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
