const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// =========================
// OBTENER USUARIOS
// =========================
const obtenerUsuarios = async (req, res) => {

    try {

        const [usuarios] = await db.query(`
            SELECT
                u.UsuCodigo,
                u.UsuUsuario,
                u.UsuEstado,
                r.RolCodigo,
                r.RolNombre,
                e.EmpCodigo,
                e.EmpNombres,
                e.EmpApellidoPaterno,
                e.EmpApellidoMaterno
            FROM Usuario u
            INNER JOIN Rol r ON u.Rol_RolCodigo = r.RolCodigo
            INNER JOIN Empleado e ON u.Empleado_EmpCodigo = e.EmpCodigo
            ORDER BY u.UsuCodigo DESC
        `);

        res.status(200).json({
            success: true,
            data: usuarios
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener usuarios',
            error: error.message
        });

    }
};


// =========================
// OBTENER POR ID
// =========================
const obtenerUsuarioPorId = async (req, res) => {

    try {

        const { id } = req.params;

        const [usuario] = await db.query(
            `SELECT * FROM Usuario WHERE UsuCodigo = ?`,
            [id]
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
            mensaje: 'Error al obtener usuario',
            error: error.message
        });

    }
};


// =========================
// CREAR USUARIO
// =========================
const crearUsuario = async (req, res) => {

    try {

        const {
            UsuUsuario,
            UsuPassword,
            UsuEstado,
            Rol_RolCodigo,
            Empleado_EmpCodigo
        } = req.body;

        // VALIDACIÓN
        if (!UsuUsuario || !UsuPassword || !UsuEstado || !Rol_RolCodigo || !Empleado_EmpCodigo) {
            return res.status(400).json({
                success: false,
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        // VALIDAR USUARIO EXISTE
        const [existe] = await db.query(
            'SELECT * FROM Usuario WHERE UsuUsuario = ?',
            [UsuUsuario]
        );

        if (existe.length > 0) {
            return res.status(400).json({
                success: false,
                mensaje: 'El usuario ya existe'
            });
        }

        // VALIDAR EMPLEADO YA TIENE USUARIO
        const [emp] = await db.query(
            'SELECT * FROM Usuario WHERE Empleado_EmpCodigo = ?',
            [Empleado_EmpCodigo]
        );

        if (emp.length > 0) {
            return res.status(400).json({
                success: false,
                mensaje: 'El empleado ya tiene usuario'
            });
        }

        // HASH PASSWORD
        const hash = await bcrypt.hash(UsuPassword, 10);

        const [result] = await db.query(`
            INSERT INTO Usuario (
                UsuUsuario,
                UsuPassword,
                UsuEstado,
                Rol_RolCodigo,
                Empleado_EmpCodigo
            ) VALUES (?, ?, ?, ?, ?)
        `, [
            UsuUsuario,
            hash,
            UsuEstado,
            Rol_RolCodigo,
            Empleado_EmpCodigo
        ]);

        res.status(201).json({
            success: true,
            mensaje: 'Usuario creado correctamente',
            data: {
                id: result.insertId,
                UsuUsuario
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            mensaje: 'Error al crear usuario',
            error: error.message
        });

    }
};


// =========================
// LOGIN
// =========================
const loginUsuario = async (req, res) => {

    try {

        const { UsuUsuario, UsuPassword } = req.body;

        if (!UsuUsuario || !UsuPassword) {
            return res.status(400).json({
                success: false,
                mensaje: 'Usuario y contraseña obligatorios'
            });
        }

        const [usuario] = await db.query(`
            SELECT
                u.*,
                r.RolNombre,
                e.EmpNombres
            FROM Usuario u
            INNER JOIN Rol r ON u.Rol_RolCodigo = r.RolCodigo
            INNER JOIN Empleado e ON u.Empleado_EmpCodigo = e.EmpCodigo
            WHERE u.UsuUsuario = ?
        `, [UsuUsuario]);

        if (usuario.length === 0) {
            return res.status(400).json({
                success: false,
                mensaje: 'Usuario no encontrado'
            });
        }

        const valido = await bcrypt.compare(
            UsuPassword,
            usuario[0].UsuPassword
        );

        if (!valido) {
            return res.status(400).json({
                success: false,
                mensaje: 'Contraseña incorrecta'
            });
        }

        const token = jwt.sign(
            {
                id: usuario[0].UsuCodigo,
                rol: usuario[0].RolNombre
            },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.status(200).json({
            success: true,
            mensaje: 'Login correcto',
            token,
            data: usuario[0]
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            mensaje: 'Error en login',
            error: error.message
        });

    }
};


// =========================
// ACTUALIZAR USUARIO (FIX REAL)
// =========================
const actualizarUsuario = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            UsuUsuario,
            UsuPassword,
            UsuEstado,
            Rol_RolCodigo,
            Empleado_EmpCodigo
        } = req.body;

        const [usuario] = await db.query(
            'SELECT * FROM Usuario WHERE UsuCodigo = ?',
            [id]
        );

        if (usuario.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: 'Usuario no encontrado'
            });
        }

        let query;
        let params;

        // SI VIENE PASSWORD
        if (UsuPassword && UsuPassword.trim() !== '') {

            const hash = await bcrypt.hash(UsuPassword, 10);

            query = `
                UPDATE Usuario SET
                    UsuUsuario = ?,
                    UsuEstado = ?,
                    Rol_RolCodigo = ?,
                    Empleado_EmpCodigo = ?,
                    UsuPassword = ?
                WHERE UsuCodigo = ?
            `;

            params = [
                UsuUsuario,
                UsuEstado,
                Rol_RolCodigo,
                Empleado_EmpCodigo,
                hash,
                id
            ];

        } else {

            // SIN PASSWORD
            query = `
                UPDATE Usuario SET
                    UsuUsuario = ?,
                    UsuEstado = ?,
                    Rol_RolCodigo = ?,
                    Empleado_EmpCodigo = ?
                WHERE UsuCodigo = ?
            `;

            params = [
                UsuUsuario,
                UsuEstado,
                Rol_RolCodigo,
                Empleado_EmpCodigo,
                id
            ];
        }

        await db.query(query, params);

        res.status(200).json({
            success: true,
            mensaje: 'Usuario actualizado correctamente'
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            mensaje: 'Error al actualizar usuario',
            error: error.message
        });

    }
};


// =========================
// ELIMINAR USUARIO
// =========================
const eliminarUsuario = async (req, res) => {

    try {

        const { id } = req.params;

        const [usuario] = await db.query(
            'SELECT * FROM Usuario WHERE UsuCodigo = ?',
            [id]
        );

        if (usuario.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: 'Usuario no encontrado'
            });
        }

        await db.query(
            'DELETE FROM Usuario WHERE UsuCodigo = ?',
            [id]
        );

        res.status(200).json({
            success: true,
            mensaje: 'Usuario eliminado correctamente'
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            mensaje: 'Error al eliminar usuario',
            error: error.message
        });

    }
};

const obtenerRoles = async (req, res) => {

  try {

    const [roles] = await db.query(`
      SELECT RolCodigo, RolNombre
      FROM Rol
      ORDER BY RolCodigo
    `);

    res.status(200).json({
      success: true,
      data: roles
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener roles',
      error: error.message
    });

  }
};
module.exports = {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    loginUsuario,
    actualizarUsuario,
    eliminarUsuario,
    obtenerRoles

};