const db = require('../config/database');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const login = async (req, res) => {

    try {

        const {
            UsuUsuario,
            UsuPassword
        } = req.body;

        if (!UsuUsuario || !UsuPassword) {

            return res.status(400).json({
                success: false,
                mensaje: 'Usuario y contraseña obligatorios'
            });

        }

        const [usuario] = await db.query(
            `SELECT

                u.*,
                r.RolNombre,

                e.EmpNombres,
                e.EmpApellidoPaterno,
                e.EmpApellidoMaterno

            FROM Usuario u

            INNER JOIN Rol r
            ON u.Rol_RolCodigo = r.RolCodigo

            INNER JOIN Empleado e
            ON u.Empleado_EmpCodigo = e.EmpCodigo

            WHERE u.UsuUsuario = ?`,
            [UsuUsuario]
        );

        if (usuario.length === 0) {

            return res.status(404).json({
                success: false,
                mensaje: 'Usuario no encontrado'
            });

        }

        if(usuario[0].UsuEstado.toLowerCase().trim() !== 'activo') {

    return res.status(401).json({
        success: false,
        mensaje: 'Usuario inactivo'
    });

}

        const passwordCorrecto = await bcrypt.compare(
            UsuPassword,
            usuario[0].UsuPassword
        );

        if (!passwordCorrecto) {

            return res.status(401).json({
                success: false,
                mensaje: 'Contraseña incorrecta'
            });

        }

        const token = jwt.sign(
            {
                UsuCodigo: usuario[0].UsuCodigo,
                Rol: usuario[0].RolNombre,
                Empleado: usuario[0].EmpNombres
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '8h'
            }
        );

        res.status(200).json({
            success: true,
            mensaje: 'Login exitoso',
            token,
            data: {
    UsuCodigo: usuario[0].UsuCodigo,
    UsuUsuario: usuario[0].UsuUsuario,
    Rol: usuario[0].RolNombre,
    Empleado: usuario[0].EmpNombres
}
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            mensaje: 'Error en autenticación',
            error: error.message
        });

    }

};

const perfil = async (req, res) => {

    try {

        const [usuario] = await db.query(
            `SELECT

                u.UsuCodigo,
                u.UsuUsuario,
                u.UsuEstado,

                r.RolNombre,

                e.EmpNombres,
                e.EmpApellidoPaterno,
                e.EmpApellidoMaterno,
                e.EmpCorreo

            FROM Usuario u

            INNER JOIN Rol r
            ON u.Rol_RolCodigo = r.RolCodigo

            INNER JOIN Empleado e
            ON u.Empleado_EmpCodigo = e.EmpCodigo

            WHERE u.UsuCodigo = ?`,
            [req.usuario.UsuCodigo]
        );

        if (usuario.length === 0) {

            return res.status(404).json({
                success: false,
                mensaje: 'Usuario no encontrado'
            });

        }

        res.status(200).json({
            success: true,
            data: usuario[0]
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener perfil',
            error: error.message
        });

    }

};

module.exports = {
    login,
    perfil
};