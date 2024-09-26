
require('dotenv').config(); // Carga las variables de entorno desde .env
const jwt = require('jsonwebtoken');
const name_authorization = process.env.authorization

function validateToken(req, res, next) {
    const token = req.headers[name_authorization];

    if (!token) {
        return res.status(403).json({ message: 'Token is missing' });
    }

    // Aquí puedes agregar lógica adicional para validar el token.
    if (token == '' || token == undefined || token == null || token == ' ') {  // Reemplaza 'expected-token-value' con el valor correcto.
        return res.status(401).json({ message: 'Invalid token' });
    }

    // Si el token es válido, continúa al siguiente middleware o ruta.
    next();
}

module.exports = { validateToken };