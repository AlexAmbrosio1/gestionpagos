import { Injectable } from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import { Observable } from 'rxjs';

import {
  environment
} from '../environment/environment';

import {
  LoginRequest,
  LoginResponse
} from '../models/auth.interface';

@Injectable({
  providedIn:'root'
})

export class AuthService {

  private apiUrl =
  `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient
  ) {}

  login(
    credentials: LoginRequest
  ): Observable<LoginResponse>{

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      credentials
    );

  }
tieneRol(rolPermitido: string[]): boolean {

  const usuario = this.obtenerUsuario();

  if (!usuario || !usuario.Rol) return false;

  return rolPermitido.includes(usuario.Rol);

}
  guardarToken(token:string):void{

    localStorage.setItem(
      'token',
      token
    );

  }

  logout(): void {

  localStorage.removeItem(
    'token'
  );

  localStorage.removeItem(
    'usuario'
  );

}
  guardarUsuario(usuario:any):void{

    localStorage.setItem(
      'usuario',
      JSON.stringify(usuario)
    );

  }

  obtenerToken():string | null {

    return localStorage.getItem(
      'token'
    );

  }
obtenerUsuario(): any {

  const usuario =
  localStorage.getItem(
    'usuario'
  );

  return usuario
  ? JSON.parse(usuario)
  : null;

}
  cerrarSesion():void{

    localStorage.clear();

  }

}