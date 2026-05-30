import { Injectable }
from '@angular/core';

import { HttpClient }
from '@angular/common/http';

import { Observable }
from 'rxjs';

import { environment }
from '../environment/environment';

import {
  AreaResponse
}
from '../models/area.interface';

@Injectable({
  providedIn:'root'
})

export class AreaService {

  private apiUrl =
  `${environment.apiUrl}/areas`;

  constructor(
    private http:HttpClient
  ) {}

  obtenerAreas():
  Observable<AreaResponse>{

    return this.http.get<AreaResponse>(
      this.apiUrl
    );

  }

}