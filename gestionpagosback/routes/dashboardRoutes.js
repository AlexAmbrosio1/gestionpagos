const express =
require('express');

const router =
express.Router();

const {

    obtenerResumen

} = require(
'../controllers/dashboardController'
);

router.get(
'/resumen',
obtenerResumen
);

module.exports =
router;