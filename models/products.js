const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize'); // Importa la configuración de Sequelize
const Category = require('./categories');

const Product = sequelize.define('products', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.BIGINT,
        allowNull: false
    },  
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Category, // Nombre del modelo referenciado
            key: 'id'        // Llave a la que hace referencia
        },
        allowNull: false
    }

}, {
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
});


Product.belongsTo(Category, { foreignKey: 'categoryId' });
Category.hasMany(Product, { foreignKey: 'categoryId' });

module.exports = Product;