require('dotenv').config(); // Carga las variables de entorno desde .env
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Role = require('../models/role');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const name_authorization = process.env.authorization

// Middleware para proteger rutas
function authenticateToken(req, res, next) {
    const authHeader = req.headers[name_authorization];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}


function validateToken(req, res, next) {
    const token = req.headers[name_authorization];

    if (!token) {
        return res.status(403).json({ message: 'Token is missing' });
    }

    // Aquí puedes agregar lógica adicional para validar el token.
    if (token !== 'expected-token-value') {  // Reemplaza 'expected-token-value' con el valor correcto.
        return res.status(401).json({ message: 'Invalid token' });
    }

    // Si el token es válido, continúa al siguiente middleware o ruta.
    next();
}
// Rutas para registrar, login, etc.
// ... (el resto del código sigue igual)

// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
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


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email },  include: [{ model: Role, attributes: ['name'] }]  });

        if (!user) {
            return res.status(400).json({ message: 'Correo o contraseña incorrectos.' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Correo o contraseña incorrectos.' });
        }

        const token = jwt.sign({ username: user.username, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        
 
        res.json({ message: 'Login exitoso.', 
            data: { user: {email: user.email, access_token: token, id: user.id,
                isAuthenticated: false, roleId: user.roleId, rolName: user.role.name, 
                firstname: user.firstname, lastname: user.lastname }, access_token: token}});
    } catch (error) {
        res.status(500).json({ message: `Error al iniciar sesión ${error.message}` });
    }
});

// Ruta protegida de ejemplo
router.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'Estás autenticado y puedes acceder a esta ruta protegida.', user: req.user });
});


module.exports = router;
