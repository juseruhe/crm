require('dotenv').config(); // Carga las variables de entorno desde .env
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Product = require('../models/products');
const Order = require('../models/orders');
const Client = require('../models/clients');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const name_authorization = process.env.authorization

router.post('/',async (req,res) => {
    try{
     const {price,quantity,referenceNo,orderDate,shippingDate,address,city,country,expiredDate,clientId} = req.body
     const order = await Order.create({price: price, quantity: quantity, referenceNo: referenceNo, 
        orderDate: orderDate, shippingDate: shippingDate, city: city, country: country, 
        expiredDate: expiredDate, clientId: clientId,address: address})

      res.status(200).json({message: "Orden creada exitosamente"})  
    }catch(e){
     res.status(500).json({message: `Error al crear una orden ${e.message}`})
    }
})

router.get('/',async(req, res) =>{
try{
const order = await Order.findAll({
  include: [{
    model: Client,
    attributes: ['firstname','lastname','nit']
  }]
});
res.status(200).json({message: "Ordenes encontradas exitosamente", data: order });
}catch(e){
res.status(500).json({message: `Error al mostrar las ordenes ${e.message}`})
}
})

router.put('/:id',async(req,res)=>{
  try{
  const {id} = req.params
  const {price,quantity,referenceNo,orderDate,shippingDate,address,city,country,expiredDate,clientId}= req.body
  const order = await Order.findByPk(id)
  await order.update({price: price, quantity: quantity, referenceNo: referenceNo, 
    orderDate: orderDate, shippingDate: shippingDate, city: city, country: country, 
    expiredDate: expiredDate, clientId: clientId,address: address})

    res.status(200).json({message: 'Orden actualizado con éxito'})

  }catch(e){
   res.status(500).json({message: `Error al actualizar la orden ${e.message}`})
  }
})

router.delete('/:id',async(req,res) =>{
 try{
const {id} = req.params
const order = await Order.findByPk(id)
await order.destroy();
res.status(200).json({message: 'Orden eliminada con éxito'})
 }catch(e){
res.status(500).json({message: `Error al eliminar la orden ${e.message}`})
 }
})


module.exports = router;