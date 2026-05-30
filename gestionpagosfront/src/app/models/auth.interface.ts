export interface LoginRequest {

    UsuUsuario:string;

    UsuPassword:string;

}

export interface UsuarioLogin {

    UsuCodigo:number;

    UsuUsuario:string;

    Rol:string;

    Empleado:string;

}

export interface LoginResponse {

    success:boolean;

    token?:string;

    data?:UsuarioLogin;

    mensaje?:string;

    error?:string;

}