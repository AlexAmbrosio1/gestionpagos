const db =
require('../config/database');

const obtenerAreas =
async (req,res) => {

    try {

        const [areas] =
        await db.query(

            `SELECT *
            FROM Area
            ORDER BY AreCodigo DESC`

        );

        res.status(200).json({

            success:true,

            count:areas.length,

            data:areas

        });

    } catch(error){

        res.status(500).json({

            success:false,

            mensaje:'Error al obtener áreas',

            error:error.message

        });

    }

};

module.exports = {

    obtenerAreas

};