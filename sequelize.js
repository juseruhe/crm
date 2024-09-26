const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.database, process.env.user, process.env.password, {
    host: process.env.database_host,
    port: process.env.port,
    dialect: 'mysql'
});

sequelize.authenticate()
    .then(() => console.log('Conexión a MySQL exitosa'))
    .catch(err => console.error('No se pudo conectar a MySQL:', err));

module.exports = sequelize;