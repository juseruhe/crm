require('dotenv').config(); // Carga las variables de entorno desde .env
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Client = require('../models/clients');
const Order = require('../models/orders');
const OrderProduct = require('../models/order-products');
const Product = require('../models/products');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const name_authorization = process.env.authorization

router.post('/',async(req,res) => {
   
    const {firstname,lastname,email,phone,mobile,nit} = req.body;
    console.log("el texto es ",req.body)
    try{
        const client = await Client.create({firstname,lastname,email,phone,mobile,nit}) 
        res.status(200).json({message: 'Cliente creado con éxito'})

    }catch(e){
        res.status(500).json({message: "Error al crear un cliente",e})
    }
} )


router.get('/', async (req, res) => {
    try {
        const clients = await Client.findAll({
            include: [{
                model: Order,
                attributes: ['referenceNo']
            }]
        });
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id',async(req,res)=>{
    try{
        const {id} = req.params
        const {firstname,lastname,email,phone,mobile,nit} = req.body;
        const client = await Client.findByPk(id)
;

        if(!client){
            res.status(404).json({message: "Cliente no encontrado"})
        }

        const update = await client.update({
            firstname: firstname,
            lastname: lastname,
            email: email,
            phone: phone,
            mobile: mobile,
           nit: nit
        })

      res.status(200).json({message: "Cliente Actualizado con éxito", data: client})
        }catch(e){
         res.status(500).json({message: "Error al actualizar el cliente",e})
        }
})

router.delete('/:id',async (req,res)=> {
    try{
     const {id} = req.params
     const client = await Client.findByPk(id)

     
     if(!client){
        res.status(404).json({message: "Cliente no encontrado"})
     }

    await client.destroy()

     res.status(200).json({message: "Cliente Eliminado con éxito"})
    }catch(e){
        res.status(500).json({message: "Error al eliminar el cliente",e})
    }
})

router.get('/:id',async (req,res)=> {
    try{
     const {id} = req.params
     const client = await Client.findByPk(id)

     
     if(!client){
        res.status(404).json({message: "Cliente no encontrado"})
     }


     res.status(200).json({message: "Cliente Encontrado con éxito", data: client})
    }catch(e){
        res.status(500).json({message: "Error al eliminar el cliente",e})
    }
})

module.exports=router