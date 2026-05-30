import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UsuarioService } from '../../services/usuario.service';
import { EmpleadoService } from '../../services/empleado.service';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioListComponent implements OnInit {

  usuarios: any[] = [];
  empleados: any[] = [];

roles: any[] = [];
mostrarErrorModal = false;
mensajeErrorModal = '';
  mostrarModal = false;
  editando = false;

  loading = false;
  loadingTabla = false;

  mostrarConfirmacion = false;
  mostrarConfirmacionEliminar = false;

  idEliminar = 0;

  mostrarMensaje = false;
  tituloMensaje = '';
  textoMensaje = '';
  tipoMensaje = '';

  mostrarPassword = false;

  dniBusqueda = '';
  empleadoSeleccionado: any = null;

  errores: any = {};

  usuario: any = this.nuevoUsuario();

  constructor(
    private usuarioService: UsuarioService,
    private empleadoService: EmpleadoService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarEmpleados();
    this.cargarRoles();
  }


  nuevoUsuario(): any {
    return {
      UsuCodigo: 0,
      UsuUsuario: '',
      UsuPassword: '',
      UsuEstado: 'Activo',
      Rol_RolCodigo: 0,
      Empleado_EmpCodigo: 0
    };
  }

 
  abrirModal(): void {
    this.mostrarModal = true;
    this.editando = false;
    this.usuario = this.nuevoUsuario();
    this.dniBusqueda = '';
    this.empleadoSeleccionado = null;
    this.errores = {};
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

cargarRoles(): void {
  this.usuarioService.getRoles().subscribe({
    next: (res: any) => {
      if (res.success) {
        this.roles = res.data;
      }
    },
    error: (err) => {
      console.log('Error roles:', err);
    }
  });
}
  buscarEmpleadoPorDni(): void {

  // 🔴 SOLO NÚMEROS
  this.dniBusqueda = this.dniBusqueda.replace(/[^0-9]/g, '');

  // 🔴 LIMITE 8 DIGITOS
  if (this.dniBusqueda.length > 8) {
    this.dniBusqueda = this.dniBusqueda.substring(0, 8);
  }

  // 🔴 SI NO TIENE 8, LIMPIA
  if (this.dniBusqueda.length !== 8) {
    this.empleadoSeleccionado = null;
    this.usuario.Empleado_EmpCodigo = 0;
    return;
  }

  // 🔍 BUSCAR EMPLEADO
  const emp = this.empleados.find(
    (e: any) => e.EmpDni === this.dniBusqueda
  );

  if (emp) {
    this.empleadoSeleccionado = emp;
    this.usuario.Empleado_EmpCodigo = emp.EmpCodigo;
  } else {
    this.empleadoSeleccionado = null;
    this.usuario.Empleado_EmpCodigo = 0;
  }
}onDniInput(event: any): void {

  let value = event.target.value;

  value = value.replace(/[^0-9]/g, '');

  if (value.length > 8) {
    value = value.substring(0, 8);
  }

  this.dniBusqueda = value;

  if (value.length !== 8) {
    this.empleadoSeleccionado = null;
    this.usuario.Empleado_EmpCodigo = 0;
    return;
  }

  const emp = this.empleados.find(
    (e: any) => e.EmpDni === value
  );

  if (emp) {
    this.empleadoSeleccionado = emp;
    this.usuario.Empleado_EmpCodigo = emp.EmpCodigo;
  } else {
    this.empleadoSeleccionado = null;
    this.usuario.Empleado_EmpCodigo = 0;
  }
}

soloNumeros(event: KeyboardEvent): void {

  const charCode = event.key;

  // 🔴 permitir solo números
  if (!/^[0-9]$/.test(charCode)) {
    event.preventDefault(); // ❌ bloquea letras
  }
}
  validarFormulario(): boolean {

    this.errores = {};

    const regex = /^[a-zA-Z0-9_]+$/;

    if (!this.usuario.UsuUsuario?.trim()) {
      this.errores.usuario = 'Ingrese usuario';
    } else if (!regex.test(this.usuario.UsuUsuario)) {
      this.errores.usuario = 'Solo letras, números o _';
    }

    if (!this.usuario.UsuPassword || this.usuario.UsuPassword.length < 6) {
      this.errores.password = 'Mínimo 6 caracteres';
    }

    if (!this.usuario.Empleado_EmpCodigo) {
      this.errores.empleado = 'Seleccione empleado';
    }

    if (!this.usuario.Rol_RolCodigo) {
      this.errores.rol = 'Seleccione rol';
    }

    return Object.keys(this.errores).length === 0;
  }


  cargarUsuarios(): void {

    this.loadingTabla = true;

    this.usuarioService.obtenerUsuarios().subscribe({
      next: (res: any) => {
        this.loadingTabla = false;
        if (res.success) this.usuarios = res.data;
      },
      error: () => this.loadingTabla = false
    });

  }

  cargarEmpleados(): void {
    this.empleadoService.obtenerEmpleados().subscribe({
      next: (res: any) => {
        if (res.success) this.empleados = res.data;
      }
    });
  }
guardarUsuario(): void {

  this.loading = true;

  const payload = {
    UsuUsuario: this.usuario.UsuUsuario,
    UsuPassword: this.usuario.UsuPassword,
    UsuEstado: this.usuario.UsuEstado,
    Rol_RolCodigo: this.usuario.Rol_RolCodigo,
    Empleado_EmpCodigo: this.usuario.Empleado_EmpCodigo
  };

  this.usuarioService.crearUsuario(payload).subscribe({
    next: (res: any) => {

      this.loading = false;

      if (res.success) {

        this.mostrarModal = false;
        this.cargarUsuarios();

      } else {

        // 🔥 error lógico backend
        this.mostrarError(res.mensaje);

      }

    },
    error: (err) => {

      this.loading = false;

      // 🔥 MENSAJE DEL BACKEND
      const mensaje = err.error?.mensaje || 'Error desconocido';

      this.mostrarError(mensaje);

    }
  });

}
mostrarError(msg: string): void {
  this.mensajeErrorModal = msg;
  this.mostrarErrorModal = true;
}
editarUsuario(u: any): void {

  this.editando = true;
  this.mostrarModal = true;

  this.usuario = {
    UsuCodigo: u.UsuCodigo,
    UsuUsuario: u.UsuUsuario,
    UsuPassword: '', // seguridad
    UsuEstado: u.UsuEstado || 'Activo',
    Rol_RolCodigo: u.Rol_RolCodigo ?? u.RolCodigo,
    Empleado_EmpCodigo: u.Empleado_EmpCodigo
  };

  this.dniBusqueda = u.EmpDni || '';
  this.empleadoSeleccionado = {
    EmpNombres: u.EmpNombres,
    EmpApellidoPaterno: u.EmpApellidoPaterno
  };
}


  actualizarUsuario(): void {
    this.mostrarConfirmacion = true;
  }
confirmarActualizacion(): void {

  const payload = {
    UsuUsuario: this.usuario.UsuUsuario,
    UsuPassword: this.usuario.UsuPassword,
    UsuEstado: this.usuario.UsuEstado,
    Rol_RolCodigo: this.usuario.Rol_RolCodigo,
    Empleado_EmpCodigo: this.usuario.Empleado_EmpCodigo
  };

  this.loading = true;

  this.usuarioService.actualizarUsuario(
    this.usuario.UsuCodigo,
    payload
  ).subscribe({
    next: (res: any) => {

      this.loading = false;
      this.mostrarConfirmacion = false;
      this.mostrarModal = false;

      if (res.success) {

        // 🔥 refrescar tabla
        this.cargarUsuarios();

        // 🔥 limpiar formulario
        this.usuario = this.nuevoUsuario();
        this.dniBusqueda = '';
        this.empleadoSeleccionado = null;

      } else {
        this.mostrarError(res.mensaje || 'No se pudo actualizar');
      }

    },
    error: (err) => {

      this.loading = false;
      this.mostrarConfirmacion = false;

      const msg = err.error?.mensaje || 'Error al actualizar';
      this.mostrarError(msg);

    }
  });

}

  cancelarConfirmacion(): void {
    this.mostrarConfirmacion = false;
  }


  eliminarUsuario(id: number): void {
    this.idEliminar = id;
    this.mostrarConfirmacionEliminar = true;
  }
confirmarEliminar(): void {

  this.usuarioService.eliminarUsuario(this.idEliminar).subscribe({
    next: (res: any) => {

      this.mostrarConfirmacionEliminar = false;

      if (res.success) {
        this.cargarUsuarios();
      } else {
        this.mostrarError(res.mensaje || 'No se pudo eliminar');
      }

    },
    error: () => {
      this.mostrarConfirmacionEliminar = false;
      this.mostrarError('Error al eliminar usuario');
    }
  });

}
cerrarError(): void {
  this.mostrarErrorModal = false;
}
  cancelarEliminar(): void {
    this.mostrarConfirmacionEliminar = false;
  }

  cerrarMensaje(): void {
    this.mostrarMensaje = false;
  }
}