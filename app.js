import express from 'express';
import session from 'express-session';
import 'dotenv/config';
import bcrypt from 'bcrypt';

import sequelize from './config/database.js';
import connectMongo from './config/mongodb.js';
import Aluno from './models/Aluno.js';

import './config/associations.js';

import categoriaRoutes from './routes/categoriaRoutes.js';
import receitaRoutes from './routes/receitaRoutes.js';
import alunoRoutes from './routes/alunoRoutes.js';
import habilidadeRoutes from './routes/habilidadeRoutes.js';
import alunoHabilidadeRoutes from './routes/alunoHabilidadeRoutes.js';
import authRoutes from './routes/authRoutes.js';
import comentarioRoutes from './routes/comentarioRoutes.js';

const app = express();

const seedAdminAluno = async () => {
  const adminName = process.env.ADMIN_NAME;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminName || !adminEmail || !adminPassword) {
    console.log('Variáveis do admin não configuradas no .env');
    return;
  }

  const adminExistente = await Aluno.findOne({
    where: { email: adminEmail },
  });

  if (adminExistente) {
    return;
  }

  await Aluno.create({
    nome: adminName,
    email: adminEmail,
    senha: await bcrypt.hash(adminPassword, 10),
    is_admin: true,
  });

  console.log('Aluno admin criado automaticamente');
};

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
    await seedAdminAluno();
    await connectMongo();

    app.listen(3000, () => {
      console.log('Servidor rodando na porta 3000');
    });
  })
  .catch((err) => {
    console.log(err);
  });
