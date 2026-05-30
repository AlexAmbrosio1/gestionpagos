const express = require('express');

const {
    verificarToken
} = require('../middlewares/authMiddleware');

const {
    validarRol
} = require('../middlewares/rolMiddleware');

const router = express.Router();

const {

    obtenerContratos,
    obtenerContratoPorId,
    crearContrato,
    actualizarContrato,
    eliminarContrato,
    buscarContratoPorDni

} = require('../controllers/contratoController');

/* =========================
   RUTAS
========================= */

router.get(
    '/',
    obtenerContratos
);

/* ESTA RUTA DEBE IR ANTES */
router.get(
    '/dni/:dni',
    buscarContratoPorDni
);

router.get(
    '/:id',
    obtenerContratoPorId
);

router.post(
    '/',
    verificarToken,
    validarRol('Administrador'),
    crearContrato
);

router.put(
    '/:id',
    actualizarContrato
);

router.delete(
    '/:id',
    verificarToken,
    validarRol('Administrador'),
    eliminarContrato
);

module.exports = router;