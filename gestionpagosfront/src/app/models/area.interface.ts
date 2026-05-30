export interface Area {

  AreCodigo?:number;

  AreNombreArea:string;

  AreSalario:number;

}

export interface AreaResponse {

  success:boolean;

  data:Area[];

}