import Receita from '../models/Receita.js';
import Categoria from '../models/Categoria.js';
import Aluno from '../models/Aluno.js';
import Habilidade from '../models/Habilidade.js';
import AlunoHabilidade from '../models/AlunoHabilidade.js';
import AlunoReceita from '../models/AlunoReceita.js';
import ReceitaCategoria from '../models/ReceitaCategoria.js';

Receita.belongsToMany(Categoria, {
  through: ReceitaCategoria,
  foreignKey: 'receita_id',
  otherKey: 'categoria_id',
});

Categoria.belongsToMany(Receita, {
  through: ReceitaCategoria,
  foreignKey: 'categoria_id',
  otherKey: 'receita_id',
});

//associação de aluno e habilidade
Aluno.belongsToMany(Habilidade, {
  through: AlunoHabilidade,
  foreignKey: 'aluno_id',
  otherKey: 'habilidade_id',
});

Habilidade.belongsToMany(Aluno, {
  through: AlunoHabilidade,
  foreignKey: 'habilidade_id',
  otherKey: 'aluno_id',
});

//associação de aluno e Receita
Aluno.belongsToMany(Receita, {
  through: AlunoReceita,
  foreignKey: 'aluno_id',
  otherKey: 'receita_id',
});

Receita.belongsToMany(Aluno, {
  through: AlunoReceita,
  foreignKey: 'receita_id',
  otherKey: 'aluno_id',
});
