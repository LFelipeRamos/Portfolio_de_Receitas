import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const AlunoReceita = sequelize.define(
  'AlunoReceita',
  {
    criador: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    freezeTableName: true,
  },
);

export default AlunoReceita;
