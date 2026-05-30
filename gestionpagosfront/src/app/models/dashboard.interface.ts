export interface DashboardResumen {

    empleados:number;

    contratos:number;

    boletas:number;

}

export interface DashboardResponse {

    success:boolean;

    data:DashboardResumen;

}