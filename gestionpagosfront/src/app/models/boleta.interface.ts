export interface Boleta {

    BolCodigo?: number;

    BolSalarioUsado: number;

    BolTotalPago: number;

    BolFechaGeneracion: string;

    BolMontoGratificacion: number;

    BolEstado: string;

    Contrato_ConCodigo: number;

    /* =========================================
       DATOS DEL EMPLEADO
    ========================================= */

    EmpNombres?: string;

    EmpApellidoPaterno?: string;

    EmpApellidoMaterno?: string;

    /* =========================================
       DATOS DEL AREA
    ========================================= */

    AreNombreArea?: string;

}

export interface BoletaResponse {

    success: boolean;

    data?: Boleta | Boleta[];

    mensaje?: string;

    error?: string;

}