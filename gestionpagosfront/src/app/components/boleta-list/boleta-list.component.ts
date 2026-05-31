
import { Component, OnInit }
from '@angular/core';

import { CommonModule }
from '@angular/common';

import { FormsModule }
from '@angular/forms';

import {
  Boleta
}
from '../../models/boleta.interface';

import {
  BoletaService
}
from '../../services/boleta.service';

import {
  ContratoService
}
from '../../services/contrato.service';

import {
  Contrato
}
from '../../models/contrato.interface';

import * as XLSX
from 'xlsx';

import { saveAs }
from 'file-saver';

import jsPDF
from 'jspdf';

import autoTable
from 'jspdf-autotable';

@Component({

  selector:'app-boleta-list',

  standalone:true,

  imports:[
    CommonModule,
    FormsModule
  ],

  templateUrl:'./boleta-list.component.html',

  styleUrl:'./boleta-list.component.css'

})

export class BoletaListComponent
implements OnInit {

  boletas:Boleta[] = [];

  contratosEmpleado:Contrato[] = [];

  contratoSeleccionado:any = null;

  mostrarModalContratos:boolean = false;

  mostrarModalConfirmacion: boolean = false;
mostrarModalDniError: boolean = false;
tituloModalDniError: string = '';
mensajeModalDniError: string = '';
tituloConfirmacion: string = '';
mensajeConfirmacion: string = '';

accionPendiente: string = ''; // guardar | eliminar
idEliminar: number | null = null;

  dniBusqueda:string = '';

  boleta:any = {

    Contrato_ConCodigo:0,

    BolSalarioUsado:0,

    BolMontoGratificacion:0,

    BolTotalPago:0,

    BolFechaGeneracion:''

  };

  constructor(

    private boletaService:BoletaService,

    private contratoService:ContratoService

  ) {}

  ngOnInit(): void {

    this.cargarBoletas();

  }

  /* =========================================
     CARGAR BOLETAS
  ========================================= */

  cargarBoletas(): void {

    this.boletaService
    .obtenerBoletas()
    .subscribe({

      next:(response)=>{

        if(
          response.success &&
          Array.isArray(response.data)
        ){

          this.boletas =
          response.data;

        }

      },

      error:(error)=>{

        console.error(error);

      }

    });

  }

  /* =========================================
     BUSCAR CONTRATOS POR DNI
  ========================================= */
buscarEmpleadoPorDni(): void {

  const dniRegex = /^[0-9]{8}$/;

  if (!dniRegex.test(this.dniBusqueda)) {
  this.mostrarModalDniError = true;
  this.tituloModalDniError = 'Error en DNI';
  this.mensajeModalDniError = 'El DNI debe tener exactamente 8 dígitos numéricos.';
  return;
}
  this.contratoService.buscarContratoPorDni(this.dniBusqueda)
    .subscribe({

      next: (response) => {

        if (response.success && Array.isArray(response.data)) {

          this.contratosEmpleado = response.data;
          this.mostrarModalContratos = true;

        } else {
          alert('El empleado no tiene contratos');
        }

      },

      error: (error) => {
        console.error(error);
        alert('Empleado no encontrado');
      }

    });

}

  /* =========================================
     SELECCIONAR CONTRATO
  ========================================= */

  seleccionarContrato(
    contrato:Contrato
  ): void {

    this.contratoSeleccionado =
    contrato;

    this.boleta.Contrato_ConCodigo =
    contrato.ConCodigo;

    this.boleta.BolSalarioUsado =
    contrato.ConSalarioActual;

    this.mostrarModalContratos =
    false;

    this.calcularGratificacion();

  }

  /* =========================================
     CERRAR MODAL
  ========================================= */

  cerrarModalContratos(): void {

    this.mostrarModalContratos =
    false;

  }
calcularGratificacion(): void {

  if (!this.contratoSeleccionado || !this.boleta.BolFechaGeneracion) {
    return;
  }

  const salario = Number(this.contratoSeleccionado.ConSalarioActual);

  // Convertir fechas sin problemas de zona horaria
  const [anioIni, mesIni, diaIni] = this.contratoSeleccionado.ConFechaInicio
    .split('-')
    .map(Number);

  const fechaInicio = new Date(anioIni, mesIni - 1, diaIni);

  const [anioBol, mesBol, diaBol] = this.boleta.BolFechaGeneracion
    .split('-')
    .map(Number);

  const fechaBoleta = new Date(anioBol, mesBol - 1, diaBol);

  const mesBoleta = fechaBoleta.getMonth() + 1;

  let inicioPeriodo: Date;
  let finPeriodo: Date;

  // Gratificación de Julio (Enero - Junio)
  if (mesBoleta === 7) {
    inicioPeriodo = new Date(fechaBoleta.getFullYear(), 0, 1);
    finPeriodo = new Date(fechaBoleta.getFullYear(), 5, 30);
  }
  // Gratificación de Diciembre (Julio - Diciembre)
  else if (mesBoleta === 12) {
    inicioPeriodo = new Date(fechaBoleta.getFullYear(), 6, 1);
    finPeriodo = new Date(fechaBoleta.getFullYear(), 11, 31);
  }
  else {
    this.boleta.BolMontoGratificacion = 0;
    this.boleta.BolTotalPago = salario;
    return;
  }

  // Si ingresó después de finalizar el semestre
  if (fechaInicio > finPeriodo) {
    this.boleta.BolMontoGratificacion = 0;
    this.boleta.BolTotalPago = salario;
    return;
  }

  // Fecha real de inicio para el cálculo
  const inicioReal = fechaInicio > inicioPeriodo
    ? fechaInicio
    : inicioPeriodo;

  let mesesTrabajados =
    (finPeriodo.getFullYear() - inicioReal.getFullYear()) * 12 +
    (finPeriodo.getMonth() - inicioReal.getMonth()) +
    1;

  // Si ingresó después del día 1 no cuenta el mes completo
  if (inicioReal.getDate() > 1) {
    mesesTrabajados--;
  }

  mesesTrabajados = Math.max(0, Math.min(6, mesesTrabajados));

  // Gratificación máxima del semestre = 300
  const gratificacion = (300 / 6) * mesesTrabajados;

  this.boleta.BolMontoGratificacion = Number(gratificacion.toFixed(2));
  this.boleta.BolTotalPago = Number((salario + gratificacion).toFixed(2));

  console.log('Fecha Inicio:', fechaInicio);
  console.log('Fecha Boleta:', fechaBoleta);
  console.log('Meses Trabajados:', mesesTrabajados);
  console.log('Gratificación:', gratificacion);
}
  /* =========================================
     GENERAR BOLETA
  ========================================= */
guardarBoleta(): void {

  if (!this.contratoSeleccionado) {
    alert('Seleccione un contrato primero');
    return;
  }

  if (!this.boleta.BolFechaGeneracion) {
    alert('Ingrese la fecha');
    return;
  }

  this.tituloConfirmacion = 'Generar Boleta';
  this.mensajeConfirmacion = '¿Deseas generar esta boleta?';
  this.accionPendiente = 'guardar';

  this.mostrarModalConfirmacion = true;
}
  /* =========================================
   ELIMINAR BOLETA
========================================= */
eliminarBoleta(id: number): void {

  this.tituloConfirmacion = 'Eliminar Boleta';
  this.mensajeConfirmacion = '¿Seguro que deseas eliminar esta boleta?';
  this.accionPendiente = 'eliminar';
  this.idEliminar = id;

  this.mostrarModalConfirmacion = true;
}
confirmarAccion(): void {

  if (this.accionPendiente === 'guardar') {
    this.procesarGuardarBoleta();
  }

  if (this.accionPendiente === 'eliminar' && this.idEliminar !== null) {
    this.procesarEliminarBoleta(this.idEliminar);
  }

  this.cerrarModalConfirmacion();
}

cancelarAccion(): void {
  this.cerrarModalConfirmacion();
}

cerrarModalConfirmacion(): void {
  this.mostrarModalConfirmacion = false;
  this.accionPendiente = '';
  this.idEliminar = null;
}

private procesarGuardarBoleta(): void {

  const data = {
    Contrato_ConCodigo: this.boleta.Contrato_ConCodigo,
    BolSalarioUsado: Number(this.boleta.BolSalarioUsado),
    BolMontoGratificacion: Number(this.boleta.BolMontoGratificacion),
    BolTotalPago: Number(this.boleta.BolTotalPago),
    BolFechaGeneracion: this.boleta.BolFechaGeneracion
  };

  this.boletaService.crearBoleta(data).subscribe({

    next: (response) => {

      this.cargarBoletas();
      this.resetFormulario();

    },

    error: (error) => {
      console.error(error);
    }

  });

}
private procesarEliminarBoleta(id: number): void {

  this.boletaService.eliminarBoleta(id).subscribe({

    next: (response) => {
      this.cargarBoletas();
    },

    error: (error) => {
      console.error(error);
    }

  });

}
private resetFormulario(): void {

  this.contratoSeleccionado = null;
  this.dniBusqueda = '';

  this.boleta = {
    Contrato_ConCodigo: 0,
    BolSalarioUsado: 0,
    BolMontoGratificacion: 0,
    BolTotalPago: 0,
    BolFechaGeneracion: ''
  };

}
exportarBoletaExcel(bol: any): void {

  const datos = [
    ['EMPLEASOFT S.A.C.'],
    ['BOLETA DE PAGO'],
    [''],
    ['Código Boleta', bol.BolCodigo],
    ['Fecha Emisión', new Date(bol.BolFechaGeneracion).toLocaleDateString('es-PE')],
    [''],
    ['DATOS DEL TRABAJADOR'],
    ['Nombre', `${bol.EmpNombres} ${bol.EmpApellidoPaterno} ${bol.EmpApellidoMaterno || ''}`],
    ['Área', bol.AreNombreArea],
    [''],
    ['DETALLE DE PAGO'],
    ['Concepto', 'Monto (S/)'],
    ['Salario Base', bol.BolSalarioUsado],
    ['Gratificación', bol.BolMontoGratificacion],
    ['TOTAL A PAGAR', bol.BolTotalPago],
    [''],
    ['Estado', bol.BolEstado]
  ];

  const ws = XLSX.utils.aoa_to_sheet(datos);

  ws['!cols'] = [
    { wch: 35 },
    { wch: 25 }
  ];

  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 1 } }
  ];

  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    wb,
    ws,
    'Boleta'
  );

  XLSX.writeFile(
    wb,
    `Boleta_${bol.BolCodigo}.xlsx`
  );
}
cerrarModalDniError(): void {
  this.mostrarModalDniError = false;
}
  /* =========================================
     EXPORTAR EXCEL
  ========================================= */

  exportarExcel(): void {}

  exportarPDF(): void {}

}

