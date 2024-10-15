require('dotenv').config(); // Carga las variables de entorno desde .env
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Role = require('../models/role');
const User = require('../models/user');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const name_authorization = process.env.authorization

router.post('/', async (req, res) => {
    const {  email, password,roleId,firstname,lastname} = req.body;

 

    if ( !email || !password) {
        return res.status(400).json({ message: 'Faltan el nombre de usuario, el correo o la contraseña.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
     
        const user = await User.create({  firstname: firstname,lastname: lastname,
            email: email, password: hashedPassword,roleId: roleId
           });

        res.status(201).json({ message: 'Usuario registrado con éxito.' });
    } catch (error) {
        res.status(500).json({ message: `Error al registrar el usuario. ${error.message}` });
    }
});

router.get('/',async(req, res) => {
try{
    const user = await User.findAll({
        include: [
            {
                model: Role,
                attributes: ['name']
            }
        ]
    });
    res.status(200).json({message: "Se encontraron todos los usuario exitosamente", data: user})
}catch(e){
res.status(500).json({message: `Error al buscar los usuarios: ${e.message}`})
}
})

router.put('/:id',async(req,res) => {
    try{
    const {id} = req.params
    const {  email, password,roleId,firstname,lastname} = req.body;
    const user = await User.findByPk(id)
    const hashedPassword = await bcrypt.hash(user.password, 10);
    
    user.update({
        firstname: firstname, lastname: lastname, email: email, password: hashedPassword, roleId: roleId
    })
    res.status(200).json({message: 'Usuario actualizado exitosamente'})
    }catch(e){
        res.status(500).json({message: `Error al actualizar el usuario ${e.message}`})
    }
})

router.get('/:id',async(req,res) =>{
    try{
        const {id} = req.params
        const user = await User.findByPk(id)
        res.status(200).json({message: 'Usuario encontrado exitosamente', data: user})
        }catch(e){
            res.status(500).json({message: `Error al buscar el usuario ${e.message}`})
        }
})

router.delete('/:id',async(req,res) =>{
    try{
        const {id} = req.params
        const user = await User.findByPk(id)
        await user.destroy();
        res.status(200).json({message: 'Usuario eliminado exitosamente'})
        }catch(e){
            res.status(500).json({message: `Error al eliminar el usuario ${e.message}`})
        }
})

module.exports = router;