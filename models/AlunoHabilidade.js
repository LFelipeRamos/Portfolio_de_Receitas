import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const AlunoHabilidade = sequelize.define(
  'AlunoHabilidade',
  {
    nivel: {
      type: DataTypes.INTEGER,
    },
  },
  {
    freezeTableName: true,
  },
);

export default AlunoHabilidade;
