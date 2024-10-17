const swaggerAutogen = require('swagger-autogen')();
const roleDocs = require('./docs/role-docs');

const doc = {
  info: {
    title: 'API de CRM UNOWEB',
    description: 'Documentación generada automáticamente',
  },
  host: 'localhost:3000',  // Cambia esto si tu API está en producción
  schemes: ['http','https'],
  securityDefinitions: {
    unoweb_authorization: {
      type: 'apiKey',
      name: 'unoweb_authorization', // El nombre del header que lleva el token
      in: 'header', // El header es donde se incluirá el token
    }
  },
  paths: {
    '/api/auth': {
      description: 'Rutas de autenticación'
    },
    '/api/url':{
      description: 'Rutas de sitios activos',
      security: [{ unoweb_authorization: [] }] 
    },
    roleDocs,
    '/api/client': {
        description: 'Rutas de clientes',
        security: [{ unoweb_authorization: [] }] 
    },
    '/api/category': {
        description: 'Rutas de categorias',
        security: [{ unoweb_authorization: [] }] 
    },
    '/api/product': {
        description: 'Rutas de clientes',
        security: [{ unoweb_authorization: [] }] 
    },
    '/api/order': {
        description: 'Rutas de Ordenes',
        security: [{ unoweb_authorization: [] }] 
    }
    // Agrega más grupos de rutas aquí si es necesario
  }
};

const outputFile = './swagger_output.json'; // Archivo JSON generado
const endpointsFiles = [
 './index.js'
]; 

swaggerAutogen(outputFile, endpointsFiles, doc);
