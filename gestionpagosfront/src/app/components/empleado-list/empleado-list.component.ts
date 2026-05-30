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
  FormsModule
}
from '@angular/forms';

import {
  Empleado
}
from '../../models/empleado.interface';

import {
  EmpleadoService
}
from '../../services/empleado.service';

@Component({

  selector:'app-empleado-list',

  standalone:true,

  imports:[

    CommonModule,
    FormsModule

  ],

  templateUrl:'./empleado-list.component.html',

  styleUrl:'./empleado-list.component.css'

})

export class EmpleadoListComponent
implements OnInit {
// ===============================
// MODALES DE MENSAJES
// ===============================

tipoMensaje: 'exito' | 'error' | 'confirmacion' | '' = '';
mensajeModal = '';
mostrarMensajeModal = false;

// Para confirmación de eliminar
idEliminar: number = 0;
mostrarConfirmarEliminar = false;
mostrarConfirmarActualizar = false;
empleadoPendiente: Empleado | null = null;
  empleados:Empleado[] = [];

  mostrarModal = false;

  editando = false;

  empleadoId = 0;

  empleado:Empleado = {

    EmpDni:'',

    EmpApellidoPaterno:'',

    EmpApellidoMaterno:'',

    EmpNombres:'',

    EmpGenero:'',

    EmpCorreo:'',

    EmpFechaNacimiento:''

  };

  constructor(

    private empleadoService:
    EmpleadoService

  ) {}

  ngOnInit(): void {

    this.cargarEmpleados();

  }

  /* =========================================
     CARGAR EMPLEADOS
  ========================================= */
confirmarActualizar(): void {

  if (!this.empleadoPendiente) return;

  this.empleadoService
    .actualizarEmpleado(this.empleadoId, this.empleadoPendiente)
    .subscribe({

      next: (response) => {

        this.mostrarMensaje(
          'exito',
          response.mensaje ?? 'Empleado actualizado correctamente'
        );

        this.cargarEmpleados();
        this.cerrarModal();
        this.mostrarConfirmarActualizar = false;
        this.empleadoPendiente = null;

      },

      error: (error) => {

        console.error(error);

        this.mostrarMensaje(
          'error',
          error.error?.mensaje || 'Error al actualizar empleado'
        );

        this.mostrarConfirmarActualizar = false;
      }

    });
}
  cargarEmpleados(): void {

    this.empleadoService
    .obtenerEmpleados()
    .subscribe({

      next:(response)=>{

        if(

          response.success &&

          Array.isArray(
            response.data
          )

        ){

          this.empleados =
          response.data.map(

            (emp:any)=>({

              ...emp,

              edad:
              this.calcularEdad(
                emp.EmpFechaNacimiento
              )

            })

          );

        }

      },

      error:(error)=>{

        console.error(error);

      }

    });

  }

  /* =========================================
     CALCULAR EDAD
  ========================================= */

  calcularEdad(
    fecha:string
  ): number {

    const hoy =
    new Date();

    const nacimiento =
    new Date(fecha);

    let edad =

      hoy.getFullYear() -

      nacimiento.getFullYear();

    const mes =

      hoy.getMonth() -

      nacimiento.getMonth();

    if(

      mes < 0 ||

      (

        mes === 0 &&

        hoy.getDate() <
        nacimiento.getDate()

      )

    ){

      edad--;

    }

    return edad;

  }

  /* =========================================
     MODAL
  ========================================= */

  abrirModal(): void {

    this.mostrarModal = true;

  }

  cerrarModal(): void {

    this.mostrarModal = false;

    this.limpiarFormulario();

  }

  /* =========================================
     GUARDAR
  ========================================= */

guardarEmpleado(form: any): void {

  if (form.controls['dni']?.invalid) {
    this.mostrarMensaje('error', 'DNI debe tener 8 números');
    return;
  }

  if (form.invalid) {
    this.mostrarMensaje('error', 'Complete todos los campos correctamente');
    return;
  }

  if (this.editando) {

    // 👇 guardar datos pendientes y abrir confirmación
    this.empleadoPendiente = { ...this.empleado };
    this.mostrarConfirmarActualizar = true;

  } else {
    this.crearEmpleado();
  }
}

  /* =========================================
     CREAR
  ========================================= */

  crearEmpleado(): void {

    this.empleadoService
    .crearEmpleado(this.empleado)
    .subscribe({

      next:(response)=>{

 this.mostrarMensaje('exito', response.mensaje ?? 'Operación exitosa');

  this.cargarEmpleados();

  this.cerrarModal();

},

      error:(error)=>{

        console.error(error);

      }

    });

  }

  /* =========================================
     EDITAR
  ========================================= */

 editarEmpleado(
  emp: Empleado
): void {

  this.editando = true;

  this.mostrarModal = true;

  this.empleadoId =
  emp.EmpCodigo || 0;

  this.empleado = {

    EmpCodigo:
    emp.EmpCodigo,

    EmpDni:
    emp.EmpDni,

    EmpApellidoPaterno:
    emp.EmpApellidoPaterno,

    EmpApellidoMaterno:
    emp.EmpApellidoMaterno,

    EmpNombres:
    emp.EmpNombres,

    EmpGenero:
    emp.EmpGenero,

    EmpCorreo:
    emp.EmpCorreo,

    EmpFechaNacimiento:
    emp.EmpFechaNacimiento
    ? emp.EmpFechaNacimiento
      .toString()
      .substring(0,10)
    : ''

  };

}

  /* =========================================
     ACTUALIZAR
  ========================================= */

  actualizarEmpleado(): void {

    this.empleadoService
    .actualizarEmpleado(

      this.empleadoId,

      this.empleado

    )
    .subscribe({

      next:(response)=>{

  this.mostrarMensaje('exito', response.mensaje ?? 'Operación exitosa');
  this.cargarEmpleados();

  this.cerrarModal();

},

      error:(error)=>{

        console.error(error);

      }

    });

  }

  /* =========================================
     ELIMINAR
  ========================================= */

 eliminarEmpleado(id:number): void {

  this.idEliminar = id;
  this.mostrarConfirmarEliminar = true;

}confirmarEliminar(): void {

  this.empleadoService.eliminarEmpleado(this.idEliminar)
  .subscribe({

    next:(response:any)=>{

      if (response.success === false) {

        this.mostrarMensaje(
          'error',
          response.mensaje || 'No se puede eliminar el empleado'
        );

        this.mostrarConfirmarEliminar = false;

        return;

      }

      this.mostrarMensaje(
        'exito',
        response.mensaje || 'Empleado eliminado correctamente'
      );

      this.cargarEmpleados();

      this.mostrarConfirmarEliminar = false;

    },

    error:(error)=>{

      this.mostrarMensaje(
        'error',
        error.error?.mensaje || 'Error al eliminar empleado, El empleado tiene contratos asociados'
      );

      this.mostrarConfirmarEliminar = false;

      console.error(error);

    }

  });

}
mostrarMensaje(tipo:'exito'|'error', mensaje:string): void {

  this.tipoMensaje = tipo;
  this.mensajeModal = mensaje;
  this.mostrarMensajeModal = true;

}
cerrarMensajeModal(): void {

  this.mostrarMensajeModal = false;

}

  /* =========================================
     LIMPIAR
  ========================================= */

  limpiarFormulario(): void {

    this.editando = false;

    this.empleadoId = 0;

    this.empleado = {

      EmpDni:'',

      EmpApellidoPaterno:'',

      EmpApellidoMaterno:'',

      EmpNombres:'',

      EmpGenero:'',

      EmpCorreo:'',

      EmpFechaNacimiento:''

    };

  }

  /* =========================================
     VALIDACIONES
  ========================================= */

  soloNumeros(
    event:any
  ): void {

    const charCode =

      event.which
      ? event.which
      : event.keyCode;

    if(

      charCode > 31 &&

      (

        charCode < 48 ||

        charCode > 57

      )

    ){

      event.preventDefault();

    }

  }

  soloLetras(
    event:any
  ): void {

    const charCode =

      event.which
      ? event.which
      : event.keyCode;

    const caracter =
    String.fromCharCode(
      charCode
    );

    const patron =

    /[A-Za-zÁÉÍÓÚáéíóúñÑ ]/;

    if(

      !patron.test(caracter)

    ){

      event.preventDefault();

    }

  }

  

}