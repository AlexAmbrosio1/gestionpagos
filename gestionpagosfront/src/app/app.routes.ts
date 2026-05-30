import { Routes } from '@angular/router';

import { LoginComponent }
from './components/login/login.component';

import { DashboardComponent }
from './components/dashboard/dashboard.component';

import { EmpleadoListComponent }
from './components/empleado-list/empleado-list.component';

import { ContratoListComponent }
from './components/contrato-list/contrato-list.component';

import { BoletaListComponent }
from './components/boleta-list/boleta-list.component';

import { AreaListComponent }
from './components/area-list/area-list.component';

import { DashboardLayoutComponent }
from './components/dashboard-layout/dashboard-layout.component';

import { authGuard }
from './guards/auth.guard';

import { UsuarioListComponent } 
from './components/usuario/usuario.component';
export const routes: Routes = [

  /* LOGIN */

  {
    path:'',
    redirectTo:'login',
    pathMatch:'full'
  },

  {
    path:'login',
    component:LoginComponent
  },

  /* SISTEMA */

  {

    path:'',

    component:DashboardLayoutComponent,

    canActivate:[
      authGuard
    ],

    children:[

      {
        path:'dashboard',
        component:DashboardComponent
      },

      {
        path:'empleados',
        component:EmpleadoListComponent
      },

      {
        path:'contratos',
        component:ContratoListComponent
      },

      {
        path:'boletas',
        component:BoletaListComponent
      },

      {
        path:'areas',
        component:AreaListComponent
      },

      {
      path: 'usuarios',
      component: UsuarioListComponent
      }

    ]

  },

  /* RUTA NO ENCONTRADA */

  {
    path:'**',
    redirectTo:'login'
  }

];