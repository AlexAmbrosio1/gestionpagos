
import { Component, OnInit }
from '@angular/core';

import { CommonModule }
from '@angular/common';

import { FormsModule }
from '@angular/forms';

import {
  Contrato
}
from '../../models/contrato.interface';

import {
  ContratoService
}
from '../../services/contrato.service';

import {
  Empleado
}
from '../../models/empleado.interface';

import {
  Area
}
from '../../models/area.interface';

import {
  EmpleadoService
}
from '../../services/empleado.service';

import {
  AreaService
}
from '../../services/area.service';

@Component({

  selector:'app-contrato-list',

  standalone:true,

  imports:[
    CommonModule,
    FormsModule
  ],

  templateUrl:'./contrato-list.component.html',

  styleUrl:'./contrato-list.component.css'

})

export class ContratoListComponent
implements OnInit {

  contratos:Contrato[] = [];

  empleados:Empleado[] = [];

  areas:Area[] = [];

  dniBusqueda:string = '';

  empleadoSeleccionado:any = null;

  mostrarModal:boolean = false;

  editando:boolean = false;

  mostrarConfirmacion:boolean = false;

  mostrarConfirmacionEliminar:boolean = false;

  salarioAnterior:number = 0;

  nuevoSalario:number = 0;

  mostrarMensaje:boolean = false;

  tituloMensaje:string = '';

  textoMensaje:string = '';

  tipoMensaje:string = '';

  loading:boolean = false;

  loadingTabla:boolean = false;

  idEliminar:number = 0;

  errores:any = {};

  contrato:Contrato = this.nuevoContrato();

  constructor(

    private contratoService:ContratoService,

    private empleadoService:EmpleadoService,

    private areaService:AreaService

  ) {}

  ngOnInit(): void {

    this.cargarContratos();

    this.cargarEmpleados();

    this.cargarAreas();

  }

  nuevoContrato():Contrato{

    return {

      ConCodigo:0,

      ConModalidad:'',

      ConJornada:'',

      ConFechaInicio:'',

      ConFechaFin:'',

      ConSalarioActual:0,

      ConEstado:'',

      Empleado_EmpCodigo:0,

      Area_AreCodigo:0

    };

  }

  mostrarModalMensaje(
    titulo:string,
    texto:string,
    tipo:string
  ): void {

    this.tituloMensaje = titulo;

    this.textoMensaje = texto;

    this.tipoMensaje = tipo;

    this.mostrarMensaje = true;

  }

  cerrarMensaje(): void {

    this.mostrarMensaje = false;

  }

  abrirModal(): void {

    this.mostrarModal = true;

    this.editando = false;

    this.contrato = this.nuevoContrato();

    this.dniBusqueda = '';

    this.empleadoSeleccionado = null;

    this.errores = {};

  }

  cerrarModal(): void {

    this.mostrarModal = false;

  }

  validarFormulario(): boolean {

    this.errores = {};

    if (!this.contrato.ConModalidad) {
  this.errores.modalidad = 'Seleccione modalidad';
}

if (!this.contrato.ConJornada) {
  this.errores.jornada = 'Seleccione jornada';
}

    if(!this.contrato.ConFechaInicio){

      this.errores.fechaInicio =
      'Seleccione fecha inicio';

    }

    if(!this.contrato.ConFechaFin){

      this.errores.fechaFin =
      'Seleccione fecha fin';

    }

    if(
      this.contrato.ConFechaInicio &&
      this.contrato.ConFechaFin &&
      this.contrato.ConFechaFin <
      this.contrato.ConFechaInicio
    ){

      this.errores.fechaFin =
      'Fecha fin inválida';

    }

    if(
      !this.contrato.Empleado_EmpCodigo
    ){

      this.errores.empleado =
      'Empleado no encontrado';

    }

    if(
      !this.contrato.Area_AreCodigo
    ){

      this.errores.area =
      'Seleccione área';

    }
if (!this.contrato.ConEstado) {
  this.errores.estado = 'Seleccione un estado';
}
    return Object.keys(
      this.errores
    ).length === 0;

  }

  buscarEmpleadoPorDni(): void {

    if(this.dniBusqueda.length !== 8){

      this.empleadoSeleccionado = null;

      this.contrato.Empleado_EmpCodigo = 0;

      return;

    }

    const empleado = this.empleados.find(

      emp => emp.EmpDni === this.dniBusqueda

    );

    if(empleado){

      this.empleadoSeleccionado = empleado;

      this.contrato.Empleado_EmpCodigo =
      Number(empleado.EmpCodigo) || 0;

    } else {

      this.empleadoSeleccionado = null;

      this.contrato.Empleado_EmpCodigo = 0;

    }

  }

  editarContrato(
    data:Contrato
  ): void {

    this.editando = true;

    this.mostrarModal = true;

    this.salarioAnterior =
    Number(data.ConSalarioActual);

    this.errores = {};

    this.contrato = {

      ConCodigo:
      Number(data.ConCodigo) || 0,

      ConModalidad:
      data.ConModalidad || '',

      ConJornada:
      data.ConJornada || '',

      ConFechaInicio:
      data.ConFechaInicio
      ? data.ConFechaInicio
        .toString()
        .substring(0,10)
      : '',

      ConFechaFin:
      data.ConFechaFin
      ? data.ConFechaFin
        .toString()
        .substring(0,10)
      : '',

      ConSalarioActual:
      Number(data.ConSalarioActual) || 0,

      ConEstado:
      data.ConEstado || 'Activo',

      Empleado_EmpCodigo:
      Number(data.Empleado_EmpCodigo) || 0,

      Area_AreCodigo:0

    };

    this.dniBusqueda =
    data.EmpDni || '';

    this.empleadoSeleccionado = {

      EmpNombres:
      data.EmpNombres,

      EmpApellidoPaterno:
      data.EmpApellidoPaterno,

      EmpDni:
      data.EmpDni

    };

    setTimeout(()=>{

      this.contrato.Area_AreCodigo =
      Number(data.Area_AreCodigo) || 0;

      this.seleccionarArea();

    },0);

  }

  cargarEmpleados(): void {

    this.empleadoService
    .obtenerEmpleados()
    .subscribe({

      next:(response:any)=>{

        if(
          response.success &&
          Array.isArray(response.data)
        ){

          this.empleados =
          response.data;

        }

      },

      error:(error)=>{

        console.error(error);

      }

    });

  }

  cargarAreas(): void {

    this.areaService
    .obtenerAreas()
    .subscribe({

      next:(response:any)=>{

        if(
          response.success &&
          Array.isArray(response.data)
        ){

          this.areas =
          response.data;

        }

      },

      error:(error)=>{

        console.error(error);

      }

    });

  }

  seleccionarArea(): void {

    const areaSeleccionada =
    this.areas.find(

      area =>

      Number(area.AreCodigo) ===
      Number(this.contrato.Area_AreCodigo)

    );

    if(areaSeleccionada){

      this.contrato.ConSalarioActual =
      Number(areaSeleccionada.AreSalario);

    }

  }

  cargarContratos(): void {

    this.loadingTabla = true;

    this.contratoService
    .obtenerContratos()
    .subscribe({

      next:(response:any)=>{

        this.loadingTabla = false;

        if(
          response.success &&
          Array.isArray(response.data)
        ){

          this.contratos =
          response.data;

        }

      },

      error:(error)=>{

        this.loadingTabla = false;

        console.error(error);

      }

    });

  }

  guardarContrato(): void {

    if(!this.validarFormulario()){

      return;

    }

    if(this.editando){

      this.actualizarContrato();

      return;

    }

    this.loading = true;

    this.contratoService
    .crearContrato(this.contrato)
    .subscribe({

      next:(response:any)=>{

        this.loading = false;

        this.mostrarModalMensaje(
          'Operación Exitosa',
          response.mensaje,
          'success'
        );

        this.cargarContratos();

        this.cerrarModal();

      },

      error:(error)=>{

        this.loading = false;

        console.error(error);

        this.mostrarModalMensaje(
          'Error',
          'No se pudo guardar el contrato',
          'error'
        );

      }

    });

  }

  actualizarContrato(): void {

    if(this.editando){

      const areaSeleccionada =
      this.areas.find(

        area =>

        Number(area.AreCodigo) ===
        Number(this.contrato.Area_AreCodigo)

      );

      if(areaSeleccionada){

        this.nuevoSalario =
        Number(areaSeleccionada.AreSalario);

      } else {

        this.nuevoSalario =
        this.contrato.ConSalarioActual;

      }

      this.mostrarConfirmacion = true;

      return;

    }

  }

  confirmarActualizacion(): void {

    this.loading = true;

    const areaSeleccionada =
    this.areas.find(

      area =>

      Number(area.AreCodigo) ===
      Number(this.contrato.Area_AreCodigo)

    );

    if(areaSeleccionada){

      this.contrato.ConSalarioActual =
      Number(areaSeleccionada.AreSalario);

    }

    this.contratoService
    .actualizarContrato(

      this.contrato.ConCodigo!,
      this.contrato

    )
    .subscribe({

      next:(response:any)=>{

        this.loading = false;

        this.mostrarModalMensaje(

          'Contrato Actualizado',
          response.mensaje,
          'success'

        );

        this.cargarContratos();

        this.cerrarModal();

        this.mostrarConfirmacion = false;

      },

      error:(error)=>{

        this.loading = false;

        console.error(error);

        this.mostrarModalMensaje(

          'Error',
          'No se pudo actualizar el contrato',
          'error'

        );

      }

    });

  }

  cancelarConfirmacion(): void {

    this.mostrarConfirmacion = false;

  }

  eliminarContrato(id:number): void {

    this.idEliminar = id;

    this.mostrarConfirmacionEliminar = true;

  }

  confirmarEliminar(): void {

    this.loading = true;

    this.contratoService
    .eliminarContrato(this.idEliminar)
    .subscribe({

      next:(response:any)=>{

        this.loading = false;

        this.mostrarConfirmacionEliminar =
        false;

        this.mostrarModalMensaje(
          'Eliminado',
          response.mensaje,
          'success'
        );

        this.cargarContratos();

      },

      error:(error)=>{

        this.loading = false;

        console.error(error);

        this.mostrarModalMensaje(
          'Error',
          'No se pudo eliminar',
          'error'
        );

      }

    });

  }

  cancelarEliminar(): void {

    this.mostrarConfirmacionEliminar =
    false;

  }

}

