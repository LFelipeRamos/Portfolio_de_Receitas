const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AlunoReceita = sequelize.define('AlunoReceita', {

    criador: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }

}, {
    freezeTableName: true
});

module.exports = AlunoReceita