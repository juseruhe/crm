require('dotenv').config(); // Carga las variables de entorno desde .env
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./sequelize');
const authRoutes = require('./auth/auth');
const urlRoutes = require('./url/url');
const clientRoutes = require('./client/client');
const {validateToken} = require('./middleware/authenticateToken');
const cors = require('cors')


const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(cors())

// Sincroniza la base de datos
sequelize.sync().then(() => {
    console.log('Base de datos sincronizada');
});

// Rutas de autenticación
app.use('/api/auth', authRoutes);
app.use('/api/url',validateToken,urlRoutes);
app.use('/api/client',validateToken,clientRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
