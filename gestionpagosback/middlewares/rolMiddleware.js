const validarRol = (rolPermitido) => {

    return (req, res, next) => {

        const rolUsuario =
        req.usuario.Rol
        ?.toLowerCase()
        .trim();

        const rolValido =
        rolPermitido
        .toLowerCase()
        .trim();

        if(rolUsuario !== rolValido){

            return res.status(403).json({

                success:false,

                mensaje:'No autorizado'

            });

        }

        next();

    };

};

module.exports = {
    validarRol
};