const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Habilidade = sequelize.define('Habilidade', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 1
    }
}, {
    freezeTableName: true

})

module.exports = Habilidade