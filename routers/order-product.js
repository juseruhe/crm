require('dotenv').config(); // Carga las variables de entorno desde .env
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Product = require('../models/products');
const Order = require('../models/orders');
const Client = require('../models/clients');
const OrderProduct = require('../models/order-products');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const name_authorization = process.env.authorization

router.post('/', async(req,res) => {
    try{
    const {orderId,productId} = req.body
    const orderProduct = await OrderProduct.create({orderId: orderId, productId: productId})
    res.status(200).json({message: "Producto con orden creada con éxito"})
    }catch(e){
        res.status(500).json({message: `Error al crear el producto ${e.message}`})
    }
})

router.get('/',async(req, res) =>{
    try{
     const orderProducts = await OrderProduct.findAll({
        include: [{
            model: Order,
            attributes: ['referenceNo']
        }, {
          model: Product,
          attributes: ['name']
        }]
     });
     res.status(200).json({message: "Productos con ordenes encontradas con éxito", data: orderProducts})
    }catch(e){
      res.status(500).json({message: `Error al crear productos con ordenes ${e.message}`});
    }
})

router.put('/:id',async(req,res)=> {
    try{
   const {id} = req.params
   const {orderId,productId} = req.body
   const orderProduct = await OrderProduct.findByPk(id)
   await orderProduct.update({
    orderId: orderId,
    productId: productId
   })
   res.status(200).json({message: 'Producto de orden actualizado con exito'})
    }catch(e){
 res.status(500).json({message: `Error al actualizar el producto de la orden actualizado ${e.message}`})
    }
})

router.delete('/:id',async(req,res) => {
    try{
   const {id} = req.params
   const orderProduct = await OrderProduct.findByPk(id)
   await orderProduct.destroy()
   res.status(200).json({message: 'Producto de la orden eliminado exitosamente' })
    }catch(e){
    res.status(500).json({message: `Error al eliminar el producto de la orden ${e.message} `})
    }
})


module.exports = router;