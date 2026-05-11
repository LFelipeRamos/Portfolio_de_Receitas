const { Sequelize } = require('sequelize');


const sequelize = new Sequelize('p_receita', 'postgres', '123456', {
    host: 'localhost',
    dialect: 'postgres',
});



module.exports = sequelize;