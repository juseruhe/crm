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
              let sslInfo = null;
              try {
                  // Intentar obtener la URL
                  const findUrl = await axios.get(url, {
                      httpsAgent: new require('https').Agent({
                          rejectUnauthorized: false
                      })
                  });

                  // Si la URL está activa, intentar obtener información SSL
                  try {
                      const sslChecker = require('ssl-checker');
                      sslInfo = await sslChecker(url.replace(/^https?:\/\//, ''));
                  } catch (sslError) {
                      console.error(`Error obteniendo información SSL para la URL ${url}:`, sslError.message);
                  }

                  // Log de URL y fecha de expiración de SSL
                  if (sslInfo) {
                      console.log(`URL: ${url}, SSL Expiration Date: ${sslInfo.validTo}`);
                  } else {
                      console.log(`URL: ${url}, No SSL information available`);
                  }

                  return { 
                      url, 
                      response: 'up', 
                      status: findUrl.status, 
                      sslExpiration: sslInfo ? sslInfo.validTo : 'SSL no disponible' 
                  }; // Éxito
                  

              } catch (err) {
                  // Si la URL está caída, obtener la información SSL de todos modos
                  console.error(`Error con la URL ${url}:`, err.message);

                  try {
                      const sslChecker = require('ssl-checker');
                      sslInfo = await sslChecker(url.replace(/^https?:\/\//, ''));
                  } catch (sslError) {
                      console.error(`Error obteniendo información SSL para la URL ${url}:`, sslError.message);
                  }

                  let status = 500; // Estado por defecto para errores
                  if (err.response) {
                      status = err.response.status; // Estado HTTP del error si está disponible
                  }

                  // Retornar el estado y mensaje de error, pero con la fecha de expiración SSL si está disponible
                  return { 
                      url, 
                      response: 'down', 
                      status, 
                      message: err.message, 
                      sslExpiration: sslInfo ? sslInfo.validTo : 'SSL no disponible'
                  };
              }
          })
      );
  
       

      // Devuelve el resultado para cada URL
      res.status(200).json({ results });
  } catch (error) {
      res.status(500).json({ response: 'Error interno', status: 500, message: error.message });
  }
});

router.post('/topUrlsExpired', async (req, res) => {
  try {
      const urls = req.body.urls; // Se espera un arreglo de URLs
  
      if (!urls || !Array.isArray(urls)) {
          return res.status(400).json({ response: 'URLs no proporcionadas o no es un arreglo', status: 400 });
      }

      // Crear un arreglo para almacenar los resultados
      const results = await Promise.all(
          urls.map(async (url) => {
              let sslInfo = null;
              try {
                  // Intentar obtener la URL
                  const findUrl = await axios.get(url, {
                      httpsAgent: new require('https').Agent({
                          rejectUnauthorized: false
                      })
                  });

                  // Si la URL está activa, intentar obtener información SSL
                  try {
                      const sslChecker = require('ssl-checker');
                      sslInfo = await sslChecker(url.replace(/^https?:\/\//, ''));
                  } catch (sslError) {
                      console.error(`Error obteniendo información SSL para la URL ${url}:`, sslError.message);
                  }

                  // Log de URL y fecha de expiración de SSL
                  if (sslInfo) {
                      console.log(`URL: ${url}, SSL Expiration Date: ${sslInfo.validTo}`);
                  } else {
                      console.log(`URL: ${url}, No SSL information available`);
                  }

                  return { 
                      url, 
                      response: 'up', 
                      status: findUrl.status, 
                      sslExpiration: sslInfo ? sslInfo.validTo : 'SSL no disponible' 
                  }; // Éxito
                  

              } catch (err) {
                  // Si la URL está caída, obtener la información SSL de todos modos
                  console.error(`Error con la URL ${url}:`, err.message);

                  try {
                      const sslChecker = require('ssl-checker');
                      sslInfo = await sslChecker(url.replace(/^https?:\/\//, ''));
                  } catch (sslError) {
                      console.error(`Error obteniendo información SSL para la URL ${url}:`, sslError.message);
                  }

                  let status = 500; // Estado por defecto para errores
                  if (err.response) {
                      status = err.response.status; // Estado HTTP del error si está disponible
                  }

                  // Retornar el estado y mensaje de error, pero con la fecha de expiración SSL si está disponible
                  return { 
                      url, 
                      response: 'down', 
                      status, 
                      message: err.message, 
                      sslExpiration: sslInfo ? sslInfo.validTo : 'SSL no disponible'
                  };
              }
          })
      );
  
        // Ordenar los resultados:
      const sortedResults = results.sort((a, b) => {
        // Si uno está caído y el otro no, poner el caído al final
        if (a.response === 'down' && b.response !== 'down') return 1;
        if (a.response !== 'down' && b.response === 'down') return -1;

        // Si ambos están "up", ordenar por fecha de expiración SSL (ascendente)
        if (a.response === 'up' && b.response === 'up') {
            if (a.sslExpiration === 'SSL no disponible') return 1;
            if (b.sslExpiration === 'SSL no disponible') return -1;
            return new Date(a.sslExpiration) - new Date(b.sslExpiration);
        }

        return 0; // Si ambos son "down", mantener el orden
    });

      // Devuelve el resultado para cada URL
      res.status(200).json({ results });
  } catch (error) {
      res.status(500).json({ response: 'Error interno', status: 500, message: error.message });
  }
});

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
