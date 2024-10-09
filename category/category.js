require('dotenv').config(); // Carga las variables de entorno desde .env
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Category = require('../models/categories');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const name_authorization = process.env.authorization

router.post('/',async(req,res) => {
    try{
    const {name} = req.body;
    const category = await Category.create({name: name});
    res.status(200).json({message: "Categoria creada con éxito"})
    }catch(e){
    res.status(500).json({message: `Error al crear la categoria ${e.message}`});
    }

})

router.get('/',async(req,res) => {
    try{
    const category = await Category.findAll();
    res.status(200).json({message: "Categorías encontradas con éxito", data: category})
    }catch(e){
     res.status(500).json({message: `Error al crear categorías ${e.message}`})
    }
})

router.put('/:id',async(req,res) =>{
    try{
   const {id} = req.params
   const {name} = req.body
   const category = await Category.findByPk(id);
   await category.update({name: name});
   res.status(200).json({message: "Categoría Actualizada con éxito"})
    }catch(e){
    res.status(500).json({message: `Error al actualizar Categoría ${e.message}`})
    }
    
})

router.delete('/:id',async(req,res)=> {
    try{
  const {id} = req.params
  const category = await Category.findByPk(id)
  await category.destroy();
  res.status(200).json({message: "Categoría Eliminada con éxito"})
    }catch(e){
res.status(500).json({message: `Error al eliminar Categoría ${e.message}`})
    }
})
module.exports = router;