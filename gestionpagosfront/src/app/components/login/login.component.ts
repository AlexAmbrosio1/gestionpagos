import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {

  UsuUsuario = '';
  UsuPassword = '';
mostrarPassword = false;
  cargando = false;

  mensajeError = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  iniciarSesion(): void {

    this.mensajeError = '';

    if (
      !this.UsuUsuario ||
      !this.UsuPassword
    ) {

      this.mensajeError =
      'Complete todos los campos';

      return;

    }

    this.cargando = true;

    const credentials = {

      UsuUsuario: this.UsuUsuario,
      UsuPassword: this.UsuPassword

    };

    this.authService
    .login(credentials)
    .subscribe({

      next:(response:any)=>{

  this.cargando = false;

  console.log('RESPUESTA:', response);

  if(response.success){

    console.log(
      'DATA:',
      response.data
    );

    console.log(
      'ROL:',
      response.data?.Rol
    );

    this.authService.guardarToken(
      response.token || ''
    );

    this.authService.guardarUsuario(
      response.data
    );

    const rol =
    response.data?.Rol;

    if(
      rol &&
      rol.toLowerCase().trim()
      === 'administrador'
    ){

      this.router.navigate([
        '/dashboard'
      ]);

    } else {

      this.router.navigate([
        '/boletas'
      ]);

    }

  }

},

      error: (error) => {

        this.cargando = false;

        console.error(error);

        this.mensajeError =
        'Usuario o contraseña incorrectos';

      }

    });

  }

}