const { DataTypes } = require('sequelize') //tipo de banco
const sequelize = require('../config/database')//onde ta 

const Aluno = sequelize.define('Aluno', {

    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false,

    },
    is_admin: {
        type: DataTypes.BOOLEAN,
        defaultValue = false
    }
}, {
    freezeTableName: true
})

module.exports = Aluno