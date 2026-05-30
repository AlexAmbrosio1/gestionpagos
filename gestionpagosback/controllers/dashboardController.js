const db =
require('../config/database');

const obtenerResumen =
async(req,res)=>{

    try{

        const [empleados] =
        await db.query(
            `
            SELECT COUNT(*) total
            FROM Empleado
            `
        );

        const [contratos] =
        await db.query(
            `
            SELECT COUNT(*) total
            FROM Contrato
            `
        );

        const [boletas] =
        await db.query(
            `
            SELECT COUNT(*) total
            FROM BoletaPago
            `
        );

        res.status(200).json({

            success:true,

            data:{

                empleados:
                empleados[0].total,

                contratos:
                contratos[0].total,

                boletas:
                boletas[0].total

            }

        });

    }catch(error){

        res.status(500).json({

            success:false,
            mensaje:'Error dashboard',
            error:error.message

        });

    }

};

module.exports = {

    obtenerResumen

};