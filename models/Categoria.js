const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')
const Receita = require('./Receita')

const Categoria = sequelize.define('Categoria', {

    nome: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }

}, {
    freezeTableName = true
})

module.exports = Categoria