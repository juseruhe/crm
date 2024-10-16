const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize'); // Importa la configuración de Sequelize
const Order = require('./orders');
const Product = require('./products');

const OrderProduct = sequelize.define('order_products', {
   
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Order, // Nombre del modelo referenciado
            key: 'id'        // Llave a la que hace referencia
        },
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
  

}, {
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
});


OrderProduct.belongsTo(Order, { foreignKey: 'orderId' });
Order.hasMany(OrderProduct, { foreignKey: 'orderId' });
OrderProduct.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(OrderProduct, { foreignKey: 'productId' });

module.exports = OrderProduct;