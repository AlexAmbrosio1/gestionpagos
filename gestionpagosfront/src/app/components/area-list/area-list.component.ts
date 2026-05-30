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
  Area
}
from '../../models/area.interface';

import {
  AreaService
}
from '../../services/area.service';

@Component({
  selector:'app-area-list',
  standalone:true,
  imports:[
    CommonModule
  ],
  templateUrl:'./area-list.component.html',
  styleUrl:'./area-list.component.css'
})

export class AreaListComponent
implements OnInit {

  areas:Area[] = [];

  constructor(
    private areaService:AreaService
  ) {}

  ngOnInit(): void {

    this.cargarAreas();

  }

  cargarAreas(): void {

    this.areaService
    .obtenerAreas()
    .subscribe({

      next:(response)=>{

        if(response.success){

         this.areas =
response.data || [];

        }

      },

      error:(error)=>{

        console.error(error);

      }

    });

  }

}