const db = require('../config/database');

/* =========================================
   OBTENER CONTRATOS
========================================= */

const obtenerContratos = async (req, res) => {

    try {

        const [contratos] = await db.query(`

            SELECT

                c.ConCodigo,
                c.ConModalidad,
                c.ConJornada,
                c.ConFechaInicio,
                c.ConFechaFin,
                c.ConSalarioActual,
                c.ConEstado,

                /* IDS IMPORTANTES */
                c.Empleado_EmpCodigo,
                c.Area_AreCodigo,

                /* EMPLEADO */
                e.EmpCodigo,
                e.EmpDni,
                e.EmpNombres,
                e.EmpApellidoPaterno,
                e.EmpApellidoMaterno,

                /* AREA */
                a.AreCodigo,
                a.AreNombreArea,

                /* ANTIGUEDAD */
                TIMESTAMPDIFF(
                    YEAR,
                    c.ConFechaInicio,
                    CURDATE()
                ) AS AntiguedadAnios,

                TIMESTAMPDIFF(
                    MONTH,
                    c.ConFechaInicio,
                    CURDATE()
                ) % 12 AS AntiguedadMeses,

                DATEDIFF(
                    CURDATE(),
                    DATE_ADD(
                        c.ConFechaInicio,
                        INTERVAL TIMESTAMPDIFF(
                            MONTH,
                            c.ConFechaInicio,
                            CURDATE()
                        ) MONTH
                    )
                ) AS AntiguedadDias

            FROM Contrato c

            INNER JOIN Empleado e
            ON c.Empleado_EmpCodigo = e.EmpCodigo

            INNER JOIN Area a
            ON c.Area_AreCodigo = a.AreCodigo

            ORDER BY c.ConCodigo DESC

        `);

        res.status(200).json({

            success: true,
            count: contratos.length,
            data: contratos

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            mensaje: 'Error al obtener contratos',
            error: error.message

        });

    }

};

/* =========================================
   OBTENER CONTRATO POR ID
========================================= */

const obtenerContratoPorId = async (req, res) => {

    try {

        const { id } = req.params;

        const [contrato] = await db.query(`

            SELECT *

            FROM Contrato

            WHERE ConCodigo = ?

        `, [id]);

        if (contrato.length === 0) {

            return res.status(404).json({

                success: false,
                mensaje: 'Contrato no encontrado'

            });

        }

        res.status(200).json({

            success: true,
            data: contrato[0]

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            mensaje: 'Error al obtener contrato',
            error: error.message

        });

    }

};

/* =========================================
   BUSCAR CONTRATO POR DNI
========================================= */

/* =========================================
   BUSCAR CONTRATOS POR DNI
========================================= */

const buscarContratoPorDni = async (req, res) => {

    try {

        const { dni } = req.params;

        const [contratos] = await db.query(`

            SELECT

                c.ConCodigo,
                c.ConModalidad,
                c.ConJornada,
                c.ConFechaInicio,
                c.ConFechaFin,
                c.ConSalarioActual,
                c.ConEstado,

                c.Empleado_EmpCodigo,
                c.Area_AreCodigo,

                e.EmpCodigo,
                e.EmpDni,
                e.EmpNombres,
                e.EmpApellidoPaterno,
                e.EmpApellidoMaterno,

                a.AreCodigo,
                a.AreNombreArea

            FROM Contrato c

            INNER JOIN Empleado e
            ON c.Empleado_EmpCodigo = e.EmpCodigo

            INNER JOIN Area a
            ON c.Area_AreCodigo = a.AreCodigo

            WHERE e.EmpDni = ?
            AND c.ConEstado = 'Activo'

            ORDER BY c.ConCodigo DESC

        `, [dni]);

        if (contratos.length === 0) {

            return res.status(404).json({

                success: false,
                mensaje: 'El empleado no tiene contratos activos'

            });

        }

        res.status(200).json({

            success: true,
            count: contratos.length,
            data: contratos

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            mensaje: 'Error al buscar contrato',
            error: error.message

        });

    }

};

/* =========================================
   CREAR CONTRATO
========================================= */

const crearContrato = async (req, res) => {

    try {

        const {

            ConModalidad,
            ConJornada,
            ConFechaInicio,
            ConFechaFin,
            ConEstado,
            Empleado_EmpCodigo,
            Area_AreCodigo

        } = req.body;

        if (

            !ConModalidad ||
            !ConJornada ||
            !ConFechaInicio ||
            !ConFechaFin ||
            !ConEstado ||
            !Empleado_EmpCodigo ||
            !Area_AreCodigo

        ) {

            return res.status(400).json({

                success: false,
                mensaje: 'Todos los campos son obligatorios'

            });

        }

        const [empleado] = await db.query(

            'SELECT * FROM Empleado WHERE EmpCodigo = ?',

            [Empleado_EmpCodigo]

        );

        if (empleado.length === 0) {

            return res.status(404).json({

                success: false,
                mensaje: 'Empleado no encontrado'

            });

        }

        const [area] = await db.query(

            'SELECT * FROM Area WHERE AreCodigo = ?',

            [Area_AreCodigo]

        );

        if (area.length === 0) {

            return res.status(404).json({

                success: false,
                mensaje: 'Área no encontrada'

            });

        }

        const salarioArea = area[0].AreSalario;

        const [resultado] = await db.query(`

            INSERT INTO Contrato
            (
                ConModalidad,
                ConJornada,
                ConFechaInicio,
                ConFechaFin,
                ConSalarioActual,
                ConEstado,
                Empleado_EmpCodigo,
                Area_AreCodigo
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)

        `, [

            ConModalidad,
            ConJornada,
            ConFechaInicio,
            ConFechaFin,
            salarioArea,
            ConEstado,
            Empleado_EmpCodigo,
            Area_AreCodigo

        ]);

        res.status(201).json({

            success: true,
            mensaje: 'Contrato creado correctamente',

            data: {

                ConCodigo: resultado.insertId,
                ConSalarioActual: salarioArea

            }

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            mensaje: 'Error al crear contrato',
            error: error.message

        });

    }

};

/* =========================================
   ACTUALIZAR CONTRATO
========================================= */

const actualizarContrato = async (req, res) => {

    try {

        const { id } = req.params;

        const {

            ConModalidad,
            ConJornada,
            ConFechaInicio,
            ConFechaFin,
            ConSalarioActual,
            ConEstado,
            Area_AreCodigo

        } = req.body;

        const [contrato] = await db.query(

            'SELECT * FROM Contrato WHERE ConCodigo = ?',

            [id]

        );

        if (contrato.length === 0) {

            return res.status(404).json({

                success: false,
                mensaje: 'Contrato no encontrado'

            });

        }

        await db.query(`

            UPDATE Contrato
            SET
                ConModalidad = ?,
                ConJornada = ?,
                ConFechaInicio = ?,
                ConFechaFin = ?,
                ConSalarioActual = ?,
                ConEstado = ?,
                Area_AreCodigo = ?
            WHERE ConCodigo = ?

        `, [

            ConModalidad,
            ConJornada,
            ConFechaInicio,
            ConFechaFin,
            ConSalarioActual,
            ConEstado,
            Area_AreCodigo,
            id

        ]);

        res.status(200).json({

            success: true,
            mensaje: 'Contrato actualizado correctamente'

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            mensaje: 'Error al actualizar contrato',
            error: error.message

        });

    }

};

/* =========================================
   ELIMINAR CONTRATO
========================================= */

const eliminarContrato = async (req, res) => {

    try {

        const { id } = req.params;

        const [contrato] = await db.query(

            'SELECT * FROM Contrato WHERE ConCodigo = ?',

            [id]

        );

        if (contrato.length === 0) {

            return res.status(404).json({

                success: false,
                mensaje: 'Contrato no encontrado'

            });

        }

        await db.query(

            'DELETE FROM Contrato WHERE ConCodigo = ?',

            [id]

        );

        res.status(200).json({

            success: true,
            mensaje: 'Contrato eliminado correctamente'

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            mensaje: 'Error al eliminar contrato',
            error: error.message

        });

    }

};

module.exports = {

    obtenerContratos,
    obtenerContratoPorId,
    buscarContratoPorDni,
    crearContrato,
    actualizarContrato,
    eliminarContrato

};