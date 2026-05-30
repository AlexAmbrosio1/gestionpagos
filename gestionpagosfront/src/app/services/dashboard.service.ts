import {
  Injectable
}
from '@angular/core';

import {
  HttpClient
}
from '@angular/common/http';

import {
  Observable
}
from 'rxjs';

import {
  environment
}
from '../environment/environment';

import {
  DashboardResponse
}
from '../models/dashboard.interface';

@Injectable({
  providedIn:'root'
})

export class DashboardService {

  private apiUrl =
  `${environment.apiUrl}/dashboard`;

  constructor(
    private http:HttpClient
  ) {}

  obtenerResumen():
  Observable<DashboardResponse>{

    return this.http.get<DashboardResponse>(
      `${this.apiUrl}/resumen`
    );

  }

}