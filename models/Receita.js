import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Receita = sequelize.define(
  'Receita',
  {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descricao: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    link_externo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  },
);

export default Receita;
