import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const AlunoHabilidade = sequelize.define(
  'AlunoHabilidade',
  {
    nivel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 10,
      },
    },
  },
  {
    freezeTableName: true,
  },
);

export default AlunoHabilidade;
