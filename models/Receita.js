const { DataTypes } = require('sequelize') //tipo de banco
const sequelize = require('../config/database')//onde ta 

const Receita = sequelize.define('Receita', {

    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descricao: {
        type: DataTypes.STRING,
        allowNull: false

    },
    link_externo: {
        type: DataTypes.STRING,
        allowNull: false,

    }
}, {
    freezeTableName: true
})

module.exports = Receita