import { Injectable }
from '@angular/core';

import { HttpClient }
from '@angular/common/http';

import { Observable }
from 'rxjs';

import { environment }
from '../environment/environment';

import {
  BoletaResponse
}
from '../models/boleta.interface';

@Injectable({

  providedIn:'root'

})

export class BoletaService {

  private apiUrl =
  `${environment.apiUrl}/boletas`;

  constructor(

    private http:HttpClient

  ) {}

  /* =========================================
     OBTENER BOLETAS
  ========================================= */

  obtenerBoletas():
  Observable<BoletaResponse>{

    return this.http.get<BoletaResponse>(
      this.apiUrl
    );

  }

  /* =========================================
     CREAR BOLETA
  ========================================= */

  crearBoleta(
    data:any
  ): Observable<BoletaResponse>{

    return this.http.post<BoletaResponse>(

      this.apiUrl,

      data

    );

  }

  eliminarBoleta(id:number){

  return this.http.delete<any>(
    `${this.apiUrl}/${id}`
  );

}

}