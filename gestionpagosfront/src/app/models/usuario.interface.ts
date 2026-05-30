export interface Usuario {
  UsuCodigo?: number;
  UsuUsuario: string;
  UsuPassword?: string;
  UsuEstado: string;

  Rol_RolCodigo: number;
  RolNombre?: string;

  Empleado_EmpCodigo: number;

  EmpNombres?: string;
  EmpApellidoPaterno?: string;
  EmpApellidoMaterno?: string;
}
export interface UsuarioResponse {

    success: boolean;

    data?: Usuario | Usuario[];

    count?: number;

    mensaje?: string;

    error?: string;

}