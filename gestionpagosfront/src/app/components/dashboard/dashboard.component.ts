import {
  Component,
  OnInit
}
from '@angular/core';

import {
  CommonModule
}
from '@angular/common';

import {
  Router,
  RouterModule
}
from '@angular/router';

import {
  AuthService
}
from '../../services/auth.service';

import {
  SidebarComponent
}
from '../sidebar/sidebar.component';

import {
  DashboardService
}
from '../../services/dashboard.service';

@Component({
  selector:'app-dashboard',
  standalone:true,
  imports:[
    CommonModule,
    SidebarComponent,
    RouterModule
  ],
  templateUrl:'./dashboard.component.html',
  styleUrl:'./dashboard.component.css'
})

export class DashboardComponent
implements OnInit {

  usuario:any;

  resumen = {

    empleados:0,
    contratos:0,
    boletas:0

  };

  constructor(

    private authService:AuthService,

    private router:Router,

    private dashboardService:DashboardService

  ) {}

  ngOnInit(): void {

    this.usuario =
    this.authService.obtenerUsuario();

    this.cargarResumen();

  }

  cargarResumen(): void {

    this.dashboardService
    .obtenerResumen()
    .subscribe({

      next:(response)=>{

        if(response.success){

          this.resumen =
          response.data;

        }

      },

      error:(error)=>{

        console.error(error);

      }

    });

  }

  cerrarSesion(): void {

    this.authService.logout();

    this.router.navigate([
      '/login'
    ]);

  }

}