const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize'); // Importa la configuración de Sequelize
const Product = require('./products');

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
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Product, // Nombre del modelo referenciado
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
    zipCode: {
        type: DataTypes.STRING,
        allowNull: true
    }

}, {
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
});


Order.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(Order, { foreignKey: 'productId' });

module.exports = Order;