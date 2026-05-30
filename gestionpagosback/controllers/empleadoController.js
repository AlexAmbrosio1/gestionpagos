const db = require('../config/database');

const obtenerEmpleados = async (req, res) => {

    try {

        const [empleados] = await db.query(
            `SELECT
                EmpCodigo,
                EmpDni,
                EmpApellidoPaterno,
                EmpApellidoMaterno,
                EmpNombres,
                EmpGenero,
                EmpCorreo,
                EmpFechaNacimiento,

                TIMESTAMPDIFF(
                    YEAR,
                    EmpFechaNacimiento,
                    CURDATE()
                ) AS EmpEdad

            FROM Empleado
            ORDER BY EmpCodigo DESC`
        );

        res.status(200).json({
            success: true,
            count: empleados.length,
            data: empleados
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener empleados',
            error: error.message
        });

    }

};

const obtenerEmpleadoPorId = async (req, res) => {

    try {

        const { id } = req.params;

        const [empleado] = await db.query(
            `SELECT
                EmpCodigo,
                EmpDni,
                EmpApellidoPaterno,
                EmpApellidoMaterno,
                EmpNombres,
                EmpGenero,
                EmpCorreo,
                EmpFechaNacimiento,

                TIMESTAMPDIFF(
                    YEAR,
                    EmpFechaNacimiento,
                    CURDATE()
                ) AS EmpEdad

            FROM Empleado
            WHERE EmpCodigo = ?`,
            [id]
        );

        if (empleado.length === 0) {

            return res.status(404).json({
                success: false,
                mensaje: 'Empleado no encontrado'
            });

        }

        res.status(200).json({
            success: true,
            data: empleado[0]
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener empleado',
            error: error.message
        });

    }

};

const crearEmpleado = async (req, res) => {

    try {

        const {
            EmpDni,
            EmpApellidoPaterno,
            EmpApellidoMaterno,
            EmpNombres,
            EmpGenero,
            EmpCorreo,
            EmpFechaNacimiento
        } = req.body;

        if (
            !EmpDni ||
            !EmpApellidoPaterno ||
            !EmpApellidoMaterno ||
            !EmpNombres ||
            !EmpGenero ||
            !EmpCorreo ||
            !EmpFechaNacimiento
        ) {

            return res.status(400).json({
                success: false,
                mensaje: 'Todos los campos son obligatorios'
            });

        }

        if (EmpDni.length !== 8) {

            return res.status(400).json({
                success: false,
                mensaje: 'El DNI debe tener exactamente 8 dígitos'
            });

        }

        if (!/^\d+$/.test(EmpDni)) {

            return res.status(400).json({
                success: false,
                mensaje: 'El DNI solo debe contener números'
            });

        }

        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!regexCorreo.test(EmpCorreo)) {

            return res.status(400).json({
                success: false,
                mensaje: 'Correo electrónico inválido'
            });

        }

        const fechaNacimiento = new Date(EmpFechaNacimiento);

        const fechaActual = new Date();

        if (fechaNacimiento >= fechaActual) {

            return res.status(400).json({
                success: false,
                mensaje: 'La fecha de nacimiento no puede ser futura'
            });

        }

        const [dniExiste] = await db.query(
            'SELECT * FROM Empleado WHERE EmpDni = ?',
            [EmpDni]
        );

        if (dniExiste.length > 0) {

            return res.status(400).json({
                success: false,
                mensaje: 'El DNI ya está registrado'
            });

        }

        const [resultado] = await db.query(
            `INSERT INTO Empleado
            (
                EmpDni,
                EmpApellidoPaterno,
                EmpApellidoMaterno,
                EmpNombres,
                EmpGenero,
                EmpCorreo,
                EmpFechaNacimiento
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                EmpDni,
                EmpApellidoPaterno,
                EmpApellidoMaterno,
                EmpNombres,
                EmpGenero,
                EmpCorreo,
                EmpFechaNacimiento
            ]
        );

        res.status(201).json({
            success: true,
            mensaje: 'Empleado creado correctamente',
            data: {
                EmpCodigo: resultado.insertId,
                EmpDni,
                EmpApellidoPaterno,
                EmpApellidoMaterno,
                EmpNombres,
                EmpGenero,
                EmpCorreo,
                EmpFechaNacimiento
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            mensaje: 'Error al crear empleado',
            error: error.message
        });

    }

};

const actualizarEmpleado = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            EmpDni,
            EmpApellidoPaterno,
            EmpApellidoMaterno,
            EmpNombres,
            EmpGenero,
            EmpCorreo,
            EmpFechaNacimiento
        } = req.body;

        const [empleado] = await db.query(
            'SELECT * FROM Empleado WHERE EmpCodigo = ?',
            [id]
        );

        if (empleado.length === 0) {

            return res.status(404).json({
                success: false,
                mensaje: 'Empleado no encontrado'
            });

        }

        if (EmpDni.length !== 8) {

            return res.status(400).json({
                success: false,
                mensaje: 'El DNI debe tener exactamente 8 dígitos'
            });

        }

        if (!/^\d+$/.test(EmpDni)) {

            return res.status(400).json({
                success: false,
                mensaje: 'El DNI solo debe contener números'
            });

        }

        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!regexCorreo.test(EmpCorreo)) {

            return res.status(400).json({
                success: false,
                mensaje: 'Correo electrónico inválido'
            });

        }

        const [dniExiste] = await db.query(
            `SELECT * FROM Empleado
            WHERE EmpDni = ?
            AND EmpCodigo <> ?`,
            [EmpDni, id]
        );

        if (dniExiste.length > 0) {

            return res.status(400).json({
                success: false,
                mensaje: 'El DNI ya pertenece a otro empleado'
            });

        }

        await db.query(
            `UPDATE Empleado
            SET
            EmpDni = ?,
            EmpApellidoPaterno = ?,
            EmpApellidoMaterno = ?,
            EmpNombres = ?,
            EmpGenero = ?,
            EmpCorreo = ?,
            EmpFechaNacimiento = ?
            WHERE EmpCodigo = ?`,
            [
                EmpDni,
                EmpApellidoPaterno,
                EmpApellidoMaterno,
                EmpNombres,
                EmpGenero,
                EmpCorreo,
                EmpFechaNacimiento,
                id
            ]
        );

        res.status(200).json({
            success: true,
            mensaje: 'Empleado actualizado correctamente'
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            mensaje: 'Error al actualizar empleado',
            error: error.message
        });

    }

};

const eliminarEmpleado = async (req, res) => {

    try {

        const { id } = req.params;

        const [empleado] = await db.query(
            'SELECT * FROM Empleado WHERE EmpCodigo = ?',
            [id]
        );

        if (empleado.length === 0) {

            return res.status(404).json({
                success: false,
                mensaje: 'Empleado no encontrado'
            });

        }

        await db.query(
            'DELETE FROM Empleado WHERE EmpCodigo = ?',
            [id]
        );

        res.status(200).json({
            success: true,
            mensaje: 'Empleado eliminado correctamente'
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            mensaje: 'Error al eliminar empleado, el empleado puede estar asociado a contratos o boletas de pago',
            error: error.message
        });

    }

};

module.exports = {
    obtenerEmpleados,
    obtenerEmpleadoPorId,
    crearEmpleado,
    actualizarEmpleado,
    eliminarEmpleado
};