require('dotenv').config(); // Carga las variables de entorno desde .env
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Product = require('../models/products');
const Category = require('../models/categories');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const name_authorization = process.env.authorization

router.post('/',async (req,res) => {
    try{
    const {name,amount,price,categoryId} = req.body;
    const product = await Product.create({name: name, amount: amount,price:price, categoryId: categoryId})
    res.status(200).json({message: "Producto creado éxitosamente"})
    }catch(e){
        res.status(500).json({message: `Error al crear el producto ${e.message}`});
    }

})

router.get('/',async(req,res)=> {
    try{
    const products = await Product.findAll({
        include: [{
            model: Category,  
            attributes: ['name']
        }]
    });
    res.status(200).json({message: "Productos encontrados correctamente", data: products});

    }catch(e){
        res.status(500).json({message: `Error al mostrar los productos ${e.message}`});
    }
})

router.put('/:id',async(req,res)=> {
    try{
 const {id}=req.params
 const {name,amount,price,categoryId} = req.body;
 const product = await Product.findByPk(id)
 await product.update({name: name, amount: amount,price:price, categoryId: categoryId})
res.status(200).json({message: 'Producto actualizado con éxito'});
    }catch(e){
res.status(500).json({message: `Error al actualizar el producto ${e.message}`});
    }
})

router.delete('/:id',async(req,res) => {
    try{
    const {id} = req.params;
    const product = await Product.findByPk(id);
    await product.destroy();
    res.status(200).json({message: 'Producto eliminado con éxito'});
    }catch(e){
    res.status(500).json({message: `Error al eliminar el producto ${e.message}`});
    }
})

module.exports = router;