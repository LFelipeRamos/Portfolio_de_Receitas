import Sequelize from 'sequelize'


const sequelize = new Sequelize('p_receita', 'postgres', '123456', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false,

});



export default sequelize