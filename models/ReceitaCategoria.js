import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ReceitaCategoria = sequelize.define(
  'ReceitaCategoria',
  {
    receita_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    categoria_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  },
  {
    freezeTableName: true,
  },
);

export default ReceitaCategoria;
