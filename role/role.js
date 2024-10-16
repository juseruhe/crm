require('dotenv').config(); // Carga las variables de entorno desde .env
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Role = require('../models/role');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const name_authorization = process.env.authorization

router.post('/',async(req,res)=> {
    try{
    const {name} = req.body;
    const role = await Role.create({name: name});
    res.status(200).json({message: "Rol creado exitosamente"})
    }catch(err){
        res.status(500).json({message: `Hubo un error al crear un rol ${err.message}`})
    }
})

router.get('/',async(req,res) => {
    try{
    const role = await Role.findAll();
    res.status(200).json({message: "Roles encontrados", data: role})
    }catch(err){
        res.status(500).json({message: ` Hubo un error al buscar los roles ${err.message}`});
    }
})

router.put('/:id',async(req,res) => {
    try{
    const {name} = req.body;
    const {id}= req.params;
    const role = await Role.findByPk(id);
    await role.update({name:name});
    res.status(200).json({"message": "Usuario Actualizado exitosamente"});
    }catch(err){
     res.status(500).json({message: `Hubó un error al actualizar el rol ${err.message}`});
    }
})

router.delete('/:id',async(req,res) =>{
    try{
    const {id} = req.params
    const {name} = req.body
    const role = await Role.findByPk(id);
   await role.destroy();
   res.status(200).json({message: "Rol eliminado exitosamente"});
    }catch(err){
    res.status(500).json({message: `Error al eliminar el rol ${err.message}`});
    }
})
module.exports = router;