require('dotenv').config(); // Carga las variables de entorno desde .env
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Url = require('../models/url');
const sslChecker = require('ssl-checker');
const axios = require('axios');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const name_authorization = process.env.authorization


router.post('/',async (req,res) => {
    try {
        const url = req.body.url;
    
        if (!url) {
          return res.status(400).json({ response: 'URL no proporcionada', status: 400 });
        }
    
        const findUrl = await axios.get(url);
    
        res.status(200).json({ response: 'up', status: 200 }); // Indicar que el sitio está "up"
      } catch (err) {
        console.error('Error al verificar la URL:', err.message);
    
        let status = 500; // Estado por defecto en caso de error
    
    
        if (err.response) {
          console.log(err)
          status = err.response.status; // Estado HTTP del error si está disponible
        }  
    
        // Respuesta coherente para errores
        res.status(status).json({ response: 'down', status, message: err.message });
      }
})


router.post('/urls', async (req, res) => {
 
    try {
        const urls = req.body.urls; // Se espera un arreglo de URLs
    
        if (!urls || !Array.isArray(urls)) {
          return res.status(400).json({ response: 'URLs no proporcionadas o no es un arreglo', status: 400 });
        }
  
  
        
    
        // Crear un arreglo para almacenar los resultados
        const results = await Promise.all(
          urls.map(async (url) => {
            try {
              const findUrl = await axios.get(url); // Intentar obtener la URL
  
              let sslInfo = null;
            try {
              const sslChecker = require('ssl-checker');
              sslInfo = await sslChecker(url.replace(/^https?:\/\//, '')); // Eliminar el protocolo para ssl-checker
            } catch (sslError) {
              console.error(`Error obteniendo información SSL para la URL ${url}:`, sslError.message);
            }
  
            // Log de URL y fecha de expiración de SSL
            if (sslInfo) {
              console.log(`URL: ${url}, SSL Expiration Date: ${sslInfo.validTo}`);
            } else {
              console.log(`URL: ${url}, No SSL information available`);
            }
  
  
              return { url, response: 'up', status: findUrl.status, sslExpiration: sslInfo ? sslInfo.validTo : 'SSL no disponible' }; // Éxito
            } catch (err) {
              console.error(`Error con la URL ${url}:`, err.message);
              
              let status = 500; // Estado por defecto para errores
              if (err.response) {
                status = err.response.status; // Estado HTTP del error si está disponible
              }
  
      
              
              // Devuelve el estado y mensaje de error para la URL fallida
              return { url, response: 'down', status, message: err.message };
            }
          })
        );
    
        // Devuelve el resultado para cada URL
        res.status(200).json({ results });
      } catch (error) {
        res.status(500).json({ response: 'Error interno', status: 500, message: error.message });
      }
})

router.get('/getUrls',async (req, res) => {
    try {
        const results = await Url.findAll()
        console.log(results);
    
        // Devolver resultados como JSON
        res.status(200).json({ results });
      } catch (err) {
        // Manejar errores
        console.error('Error al ejecutar consulta:', err);
    
        // Devolver respuesta con mensaje de error
        res.status(500).json({
          error: 'Error al obtener usuarios',
          details: err.message,
        });
      }
})

router.post('/addUrl', async (req, res) => {
    try {
    
        let urlBody= new Url();
 
 
         urlBody.name = req.body.url
          
         const result = await Url.create({name: urlBody.name}) // Intentar insertar usuario
     
         // Devolver resultado como JSON
         res.status(200).json({ result });
       } catch (err) {
         console.error('Error al insertar usuario:', err.message);
     
         // Manejo de errores
         res.status(500).json({
           error: 'Error al insertar usuario',
           details: err.message,
         })
     }
})

router.delete('/deleteUrl/:id', async(req, res) =>{
    try {
        const urlId = req.params.id; 
  
        var urlBody= new Url();
  
        urlBody.id = parseInt(req.params.id)
    
        const result = await Url.destroy({where :{id: urlBody.id}}); // Eliminar usuario
    
    
        // Respuesta en caso de éxito
        res.status(200).json({ result });
      } catch (err) {
        console.error('Error al eliminar usuario:', err.message);
    
        // Manejar errores y devolver respuesta con detalles
        res.status(500).json({
          error: 'Error al eliminar usuario',
          status: 500,
          details: err.message,
        });
      }
})

router.put('/editUrl/:id',async (req, res) => {
    try {
        var urlBody= new Url();
   
        urlBody.id = parseInt(req.params.id)
        urlBody.name = req.body.name
   
         const result = await Url.update(urlBody)// Intentar actualizar usuario
     
         // Respuesta de éxito
         res.status(200).json({ result });
       } catch (err) {
         console.error('Error al editar usuario:', err.message);
     
         // Manejo de errores
         res.status(500).json({
           error: 'Error al editar usuario',
           status: 500,
           details: err.message,
         });
       }
})


module.exports = router;
