const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const AlunoHabilidade = sequelize.define('AlunoHabilidade', {

    nivel: {
        type: DataTypes.INTEGER
    }
}, {
    freezeTableName: true
})

module.exports = AlunoHabilidade