const Receita = require('../models/Receita');
const Categoria = require('../models/Categoria');
const Aluno = require('../models/Aluno');
const Habilidade = require('../models/Habilidade');
const AlunoHabilidade = require('../models/AlunoHabilidade');
const AlunoReceita = require('../models/AlunoReceita')

Receita.belongsToMany(Categoria, {
    through: 'ReceitaCategoria'
});

Categoria.belongsToMany(Receita, {
    through: 'ReceitaCategoria'
});

//associação de aluno e habilidade
Aluno.belongsToMany(Habilidade, {
    through: AlunoHabilidade
});

Habilidade.belongsToMany(Aluno, {
    through: AlunoHabilidade
});

//associação de aluno e Receita
Aluno.belongsToMany(Habilidade, {
    through: AlunoHabilidade
});

Habilidade.belongsToMany(Aluno, {
    through: AlunoHabilidade
});