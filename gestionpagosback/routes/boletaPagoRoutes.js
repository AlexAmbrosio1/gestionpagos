const express = require('express');

const router = express.Router();

const {
    obtenerBoletas,
    obtenerBoletaPorId,
    crearBoleta,
    eliminarBoleta
} = require('../controllers/boletaPagoController');

router.get('/', obtenerBoletas);

router.get('/:id', obtenerBoletaPorId);

router.post('/', crearBoleta);

router.delete('/:id', eliminarBoleta);

module.exports = router;