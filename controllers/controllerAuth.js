import bcrypt from 'bcrypt';
import Aluno from '../models/Aluno.js';

const login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({
      error: 'Informe email e senha.',
    });
  }

  const aluno = await Aluno.findOne({
    where: {
      email: email.trim().toLowerCase(),
    },
  });

  if (!aluno) {
    return res.status(401).json({
      error: 'Email ou senha inválidos.',
    });
  }

  const senhaCorreta = await bcrypt.compare(senha, aluno.senha);

  if (!senhaCorreta) {
    return res.status(401).json({
      error: 'Email ou senha inválidos.',
    });
  }

  req.session.aluno = {
    id: aluno.id,
    nome: aluno.nome,
    email: aluno.email,
    is_admin: aluno.is_admin,
  };

  return res.status(200).json({
    message: 'Login realizado com sucesso',
    aluno: req.session.aluno,
  });
};

const logout = (req, res) => {
  req.session.destroy(() => {
    res.status(200).json({
      message: 'Logout realizado com sucesso',
    });
  });
};

const me = (req, res) => {
  if (!req.session.aluno) {
    return res.status(200).json({
      aluno: null,
    });
  }

  return res.status(200).json({
    aluno: req.session.aluno,
  });
};

export { login, logout, me };
