import express from 'express';

import sequelize from './config/database.js';

import './config/associations.js';

import categoriaRoutes from './routes/categoriaRoutes.js';
import receitaRoutes from './routes/receitaRoutes.js';
// import alunoRoutes from './routes/alunoRoutes.js';
// import habilidadeRoutes from './routes/habilidadeRoutes.js';
//import alunoHabilidadeRoutes from './routes/alunoHabilidadeRoutes.js';

const app = express();

// permite JSON
app.use(express.json());

app.use('/categorias', categoriaRoutes);
app.use('/receitas', receitaRoutes);
// app.use('/alunos', alunoRoutes);
// app.use('/habilidades', habilidadeRoutes);
//app.use('/aluno-habilidades', alunoHabilidadeRoutes);

// rota teste
app.get('/', (req, res) => {
  res.send('API funcionando');
});

// sincroniza banco
sequelize
  .sync()
  .then(() => {
    console.log('Banco sincronizado');

    app.listen(3000, () => {
      console.log('Servidor rodando na porta 3000');
    });
  })
  .catch((err) => {
    console.log(err);
  });
