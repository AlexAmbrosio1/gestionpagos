const express = require('express');
const router = express.Router();

const {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    loginUsuario,
    actualizarUsuario,
    eliminarUsuario,
    obtenerRoles
} = require('../controllers/usuarioController');

// ✅ primero rutas específicas
router.get('/roles', obtenerRoles);

// ✅ luego rutas generales
router.get('/', obtenerUsuarios);
router.get('/:id', obtenerUsuarioPorId);

router.post('/', crearUsuario);
router.post('/login', loginUsuario);
router.put('/:id', actualizarUsuario);
router.delete('/:id', eliminarUsuario);

module.exports = router;