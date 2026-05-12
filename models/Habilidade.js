import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Habilidade = sequelize.define(
  'Habilidade',
  {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    freezeTableName: true,
  },
);

export default Habilidade;
