const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize'); // Importa la configuración de Sequelize
const Client = require('./clients');


const Order = sequelize.define('orders', {
    referenceNo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.BIGINT,
        allowNull: false
    },  
    clientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Client, // Nombre del modelo referenciado
            key: 'id'        // Llave a la que hace referencia
        },
        allowNull: false
    },
    orderDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    shippingDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expiredDate: {
        type: DataTypes.DATE,
        allowNull: true
    }

}, {
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
});


Order.belongsTo(Client, { foreignKey: 'clientId' });
Client.hasMany(Order, { foreignKey: 'clientId' });



module.exports = Order;