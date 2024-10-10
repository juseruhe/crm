const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize'); // Importa la configuración de Sequelize
const Role = require('./role');

const User = sequelize.define('user', {
    firstname: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Role,
            key: 'id'
        }
    }

}, {
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
});

User.belongsTo(Role, { foreignKey: 'roleId' });
Role.hasMany(User, { foreignKey: 'roleId' });

module.exports = User;
