export interface Contrato {

    ConCodigo?: number;

    ConModalidad: string;

    ConJornada: string;

    ConFechaInicio: string;

    ConFechaFin: string;

    ConSalarioActual: number;

    ConEstado: string;

    Empleado_EmpCodigo: number;

    Area_AreCodigo: number;

    /* EMPLEADO */

    EmpCodigo?: number;

    EmpDni?: string;

    EmpNombres?: string;

    EmpApellidoPaterno?: string;

    EmpApellidoMaterno?: string;

    /* AREA */

    AreCodigo?: number;

    AreNombreArea?: string;

    /* ANTIGUEDAD */

    AntiguedadAnios?: number;

    AntiguedadMeses?: number;

    AntiguedadDias?: number;

}

export interface ContratoResponse {

    success: boolean;

    data?: Contrato | Contrato[];

    count?: number;

    mensaje?: string;

    error?: string;

}