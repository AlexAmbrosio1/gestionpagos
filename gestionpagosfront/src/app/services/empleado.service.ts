import { Injectable }
from '@angular/core';

import { HttpClient }
from '@angular/common/http';

import { Observable }
from 'rxjs';

import { environment }
from '../environment/environment';

import {
  Empleado,
  EmpleadoResponse
}
from '../models/empleado.interface';

@Injectable({
  providedIn: 'root'
})

export class EmpleadoService {

  private apiUrl =
  `${environment.apiUrl}/empleados`;

  constructor(
    private http: HttpClient
  ) {}

  obtenerEmpleados():
  Observable<EmpleadoResponse>{

    return this.http.get<EmpleadoResponse>(
      this.apiUrl
    );

  }

  obtenerEmpleadoPorId(id:number):
  Observable<EmpleadoResponse>{

    return this.http.get<EmpleadoResponse>(
      `${this.apiUrl}/${id}`
    );

  }

  crearEmpleado(empleado:Empleado):
  Observable<EmpleadoResponse>{

    return this.http.post<EmpleadoResponse>(
      this.apiUrl,
      empleado
    );

  }

  actualizarEmpleado(
    id:number,
    empleado:Empleado
  ): Observable<EmpleadoResponse>{

    return this.http.put<EmpleadoResponse>(
      `${this.apiUrl}/${id}`,
      empleado
    );

  }

  eliminarEmpleado(id:number):
  Observable<EmpleadoResponse>{

    return this.http.delete<EmpleadoResponse>(
      `${this.apiUrl}/${id}`
    );

  }

}