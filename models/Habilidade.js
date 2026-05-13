import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Habilidade = sequelize.define(
  'Habilidade',
  {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    freezeTableName: true,
  },
);

export default Habilidade;
