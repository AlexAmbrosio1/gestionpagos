import { Injectable }
from '@angular/core';

import { HttpClient }
from '@angular/common/http';

import { Observable }
from 'rxjs';

import { environment }
from '../environment/environment';

import {
  Contrato,
  ContratoResponse
}
from '../models/contrato.interface';

@Injectable({
  providedIn:'root'
})

export class ContratoService {

  private apiUrl =
  `${environment.apiUrl}/contratos`;

  constructor(
    private http:HttpClient
  ) {}

  obtenerContratos():
  Observable<ContratoResponse>{

    return this.http.get<ContratoResponse>(
      this.apiUrl
    );

  }

  buscarContratoPorDni(
  dni:string
): Observable<ContratoResponse>{

  return this.http.get<ContratoResponse>(
    `${this.apiUrl}/dni/${dni}`
  );

}

  crearContrato(
    contrato:Contrato
  ): Observable<ContratoResponse>{

    return this.http.post<ContratoResponse>(
      this.apiUrl,
      contrato
    );

  }

  actualizarContrato(
    id:number,
    contrato:Contrato
  ): Observable<ContratoResponse>{

    return this.http.put<ContratoResponse>(
      `${this.apiUrl}/${id}`,
      contrato
    );

  }

  eliminarContrato(id:number):
  Observable<ContratoResponse>{

    return this.http.delete<ContratoResponse>(
      `${this.apiUrl}/${id}`
    );

  }

}