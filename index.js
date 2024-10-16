require('dotenv').config(); // Carga las variables de entorno desde .env
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./sequelize');

const authRoutes = require('./routers/auth');
const urlRoutes = require('./routers/url');
const clientRoutes = require('./routers/client');
const roleRoutes = require('./routers/role');
const categoryRoutes = require('./routers/category');
const productRoutes = require('./routers/product');
const orderRoutes = require('./routers/order');
const orderProductRoutes = require('./routers/order-product');
const userRoutes = require('./routers/user');
const {validateToken} = require('./middleware/authenticateToken');
const cors = require('cors');
const https = require('https'); 
const fs = require('fs');
const http = require('http');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');


const app = express();

const PORT_HTTP = process.env.PORT || 3000; // Puerto para HTTP
const PORT_HTTPS = process.env.PORT || 3000; // Puerto para HTTPS


app.use(bodyParser.json());

app.use(cors())

// El uso de swagger para la documentación
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Sincroniza la base de datos
sequelize.sync().then(() => {
    console.log('Base de datos sincronizada');
});


// Rutas de autenticación
app.use('/api/auth', authRoutes);
app.use('/api/url',validateToken,urlRoutes);
app.use('/api/client',validateToken,clientRoutes);
app.use('/api/role',validateToken,roleRoutes);
app.use('/api/category',validateToken,categoryRoutes);
app.use('/api/product/',validateToken,productRoutes);
app.use('/api/order/',validateToken,orderRoutes);
app.use('/api/order-product/',validateToken,orderProductRoutes);
app.use('/api/user',validateToken,userRoutes);

// Verificar si existen los archivos de los certificados SSL
const sslOptions = {
    key: fs.existsSync('/etc/nginx/ssl-certificates/siloma.unoweb.com.co.key') ?
     fs.readFileSync('/etc/nginx/ssl-certificates/siloma.unoweb.com.co.key') : null,
    cert: fs.existsSync('/etc/nginx/ssl-certificates/siloma.unoweb.com.co.crt') ? 
    fs.readFileSync('/etc/nginx/ssl-certificates/siloma.unoweb.com.co.crt') : null
  };
  
  // Si los certificados están presentes, crea el servidor HTTPS
  if (sslOptions.key && sslOptions.cert) {

    https.createServer(sslOptions, app).listen(PORT_HTTPS, () => {
      console.log(`Servidor HTTPS corriendo en https://localhost:${PORT_HTTPS}`);
    });

  } else {
      // Crear el servidor HTTP como alternativa
   
      http.createServer(app).listen(PORT_HTTP, () => {
    console.log(`Servidor HTTP corriendo en http://localhost:${PORT_HTTP}`);
    
  });
    console.log('Certificados SSL no encontrados, corriendo el servidor en HTTP.');
  }
  


