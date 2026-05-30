require('dotenv').config();
const express = require('express');
const cors = require('cors');


const areaRoutes = require('./routes/areaRoutes');
const empleadoRoutes = require('./routes/empleadoRoutes');
const contratoRoutes = require('./routes/contratoRoutes');
const boletaPagoRoutes = require('./routes/boletaPagoRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes =
require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/areas', areaRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/contratos', contratoRoutes);
app.use('/api/boletas', boletaPagoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/auth', authRoutes);
app.use(
'/api/dashboard',
dashboardRoutes
);


app.get('/', (req, res) => {
    res.json({
        mensaje: 'API de pagos funcionando correctamente'
    });

});
app.listen(PORT, ()=>{
    console.log(`servidor corriendo en el puerto ${PORT}`)
});
