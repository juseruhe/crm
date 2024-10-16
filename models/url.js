const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize'); // Importa la configuración de Sequelize

const Url = sequelize.define('urls', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

},{
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
});


module.exports = Url;