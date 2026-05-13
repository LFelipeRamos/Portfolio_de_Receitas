import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const AlunoHabilidade = sequelize.define(
  'AlunoHabilidade',
  {
    aluno_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    habilidade_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
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
