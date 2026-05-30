import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  obtenerUsuarios(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHeaders());
  }

  obtenerUsuarioPorId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, this.getHeaders());
  }

  crearUsuario(data: Usuario): Observable<any> {
    return this.http.post(this.apiUrl, data, this.getHeaders());
  }

  actualizarUsuario(id: number, data: Usuario): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data, this.getHeaders());
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getHeaders());
  }

  login(data: any): Observable<any> {
    return this.http.post('http://localhost:3000/api/login', data);
  }

    getRoles() {
  return this.http.get('http://localhost:3000/api/usuarios/roles');
}
}