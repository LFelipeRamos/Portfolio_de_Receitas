import express from 'express';
import session from 'express-session';
import 'dotenv/config';

import sequelize from './config/database.js';
import connectMongo from './config/mongodb.js';

import './config/associations.js';

import categoriaRoutes from './routes/categoriaRoutes.js';
import receitaRoutes from './routes/receitaRoutes.js';
import alunoRoutes from './routes/alunoRoutes.js';
import habilidadeRoutes from './routes/habilidadeRoutes.js';
import alunoHabilidadeRoutes from './routes/alunoHabilidadeRoutes.js';
import authRoutes from './routes/authRoutes.js';
import comentarioRoutes from './routes/comentarioRoutes.js';

const app = express();

app.use(express.static('dist'));

// permite JSON
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

app.use('/', authRoutes);
app.use('/categorias', categoriaRoutes);
app.use('/receitas', receitaRoutes);
app.use('/alunos', alunoRoutes);
app.use('/habilidades', habilidadeRoutes);
app.use('/aluno-habilidades', alunoHabilidadeRoutes);
app.use('/comentarios', comentarioRoutes);

// rota teste
app.get('/api', (req, res) => {
  res.send('API funcionando');
});

// sincroniza banco
sequelize
  .sync()
  .then(async () => {
    console.log('Banco sincronizado');
    await connectMongo();

    app.listen(3000, () => {
      console.log('Servidor rodando na porta 3000');
    });
  })
  .catch((err) => {
    console.log(err);
  });
