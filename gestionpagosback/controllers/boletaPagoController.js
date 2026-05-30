const db = require('../config/database');

const obtenerBoletas = async (req, res) => {

    try {

        const [boletas] = await db.query(
            `SELECT

                b.BolCodigo,
                b.BolSalarioUsado,
                b.BolMontoGratificacion,
                b.BolTotalPago,
                b.BolFechaGeneracion,
                b.BolEstado,

                e.EmpNombres,
                e.EmpApellidoPaterno,
                e.EmpApellidoMaterno,

                a.AreNombreArea

            FROM BoletaPago b

            INNER JOIN Contrato c
            ON b.Contrato_ConCodigo = c.ConCodigo

            INNER JOIN Empleado e
            ON c.Empleado_EmpCodigo = e.EmpCodigo

            INNER JOIN Area a
            ON c.Area_AreCodigo = a.AreCodigo

            ORDER BY b.BolCodigo DESC`
        );

        res.status(200).json({
            success: true,
            count: boletas.length,
            data: boletas
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener boletas',
            error: error.message
        });

    }

};

const obtenerBoletaPorId = async (req, res) => {

    try {

        const { id } = req.params;

        const [boleta] = await db.query(
            'SELECT * FROM BoletaPago WHERE BolCodigo = ?',
            [id]
        );

        if (boleta.length === 0) {

            return res.status(404).json({
                success: false,
                mensaje: 'Boleta no encontrada'
            });

        }

        res.status(200).json({
            success: true,
            data: boleta[0]
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener boleta',
            error: error.message
        });

    }

};
const crearBoleta = async (req, res) => {

    try {

        const { 
  Contrato_ConCodigo,
  BolSalarioUsado,
  BolMontoGratificacion,
  BolTotalPago,
  BolFechaGeneracion
} = req.body;

        /* VALIDAR */
        if (!Contrato_ConCodigo) {

            return res.status(400).json({
                success: false,
                mensaje: 'El contrato es obligatorio'
            });

        }

        /* VALIDAR CONTRATO */
        const [contrato] = await db.query(
            'SELECT * FROM Contrato WHERE ConCodigo = ?',
            [Contrato_ConCodigo]
        );

        if (contrato.length === 0) {

            return res.status(404).json({
                success: false,
                mensaje: 'Contrato no encontrado'
            });

        }

        /* INSERTAR */
        const [resultado] = await db.query(
            `INSERT INTO BoletaPago
(
    BolSalarioUsado,
    BolMontoGratificacion,
    BolTotalPago,
    BolFechaGeneracion,
    BolEstado,
    Contrato_ConCodigo
)
VALUES (?, ?, ?, ?, ?, ?)`,
            [
                BolSalarioUsado,
                BolMontoGratificacion,
                BolTotalPago,
                BolFechaGeneracion,
                'GENERADO',
                Contrato_ConCodigo
            ]
        );

        /* RESPUESTA */
        res.status(201).json({

            success: true,

            mensaje:
            'Boleta generada correctamente',

            data: {

                BolCodigo:
                resultado.insertId

            }

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            mensaje:
            'Error al generar boleta',

            error:
            error.message

        });

    }

};

const eliminarBoleta = async (req, res) => {

    try {

        const { id } = req.params;

        const [boleta] = await db.query(
            'SELECT * FROM BoletaPago WHERE BolCodigo = ?',
            [id]
        );

        if (boleta.length === 0) {

            return res.status(404).json({
                success: false,
                mensaje: 'Boleta no encontrada'
            });

        }

        await db.query(
            'DELETE FROM BoletaPago WHERE BolCodigo = ?',
            [id]
        );

        res.status(200).json({
            success: true,
            mensaje: 'Boleta eliminada correctamente'
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            mensaje: 'Error al eliminar boleta',
            error: error.message
        });

    }

};

module.exports = {
    obtenerBoletas,
    obtenerBoletaPorId,
    crearBoleta,
    eliminarBoleta
};