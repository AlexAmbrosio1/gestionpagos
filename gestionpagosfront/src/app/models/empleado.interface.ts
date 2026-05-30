export interface Empleado {

    EmpCodigo?: number;

    EmpDni: string;

    EmpApellidoPaterno: string;

    EmpApellidoMaterno: string;

    EmpNombres: string;

    EmpGenero: string;

    EmpCorreo: string;

    EmpFechaNacimiento: string;

    edad?: number;

}

export interface EmpleadoResponse {

    success: boolean;

    data?: Empleado | Empleado[];

    count?: number;

    mensaje?: string;

    error?: string;

}