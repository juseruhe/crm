require('dotenv').config(); // Carga las variables de entorno desde .env
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Client = require('../models/clients');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const name_authorization = process.env.authorization

router.post('/',async(req,res) => {
    const {firstname,lastname,email,phone,mobile,rewards,membership} = req.body
    try{
        const client = Client.create({firstname,lastname,email,phone,mobile,rewards,membership}) 
        res.status(200).json({message: 'Cliente creado con éxito'})

    }catch(e){
        res.status(500).json({message: "Error al crear un cliente",e})
    }
} )

module.exports = router