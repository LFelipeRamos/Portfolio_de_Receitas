import Aluno from '../models/Aluno.js';
import bcrypt from 'bcrypt';

const getAlunos = async (req, res) => {
  const aluno = await Aluno.findAll({
    order: [['nome', 'ASC']],
  });

  if (aluno.length === 0) {
    return res.status(404).json({
      error: 'Alunos não encontrados',
    });
  }
  return res.status(200).json(aluno);
};

const createAluno = async (req, res) => {
  const { nome, email, senha, is_admin } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({
      error: 'Informe nome, email e senha.',
    });
  }
  const emailLimpo = email.trim().toLowerCase();

  if (!emailLimpo.includes('@') || !emailLimpo.includes('.')) {
    return res.status(400).json({
      erro: 'Informe um email válido.',
    });
  }

  try {
    const totalAlunos = await Aluno.count();

    await Aluno.create({
      nome,
      email: emailLimpo,
      senha: await bcrypt.hash(senha, 10),
      is_admin: totalAlunos === 0 ? true : is_admin,
    });

    return res.status(201).json({
      message: 'Aluno criado com sucesso',
    });
  } catch {
    return res.status(400).json({
      error: 'Não foi possível salvar o usuário.',
    });
  }
};

const updateAluno = async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha, is_admin } = req.body;

  const aluno = await Aluno.findByPk(id);
  if (!aluno) {
    return res.status(404).json({
      error: 'Aluno não encontrado',
    });
  }

  try {
    const dadosAtualizados = {};

    if (nome !== undefined) {
      dadosAtualizados.nome = nome;
    }

    if (email !== undefined) {
      dadosAtualizados.email = email.trim().toLowerCase();
    }

    if (senha !== undefined) {
      dadosAtualizados.senha = await bcrypt.hash(senha, 10);
    }

    if (is_admin !== undefined) {
      dadosAtualizados.is_admin = is_admin;
    }

    await aluno.update(dadosAtualizados);
    return res.status(200).json({
      message: 'Aluno atualizado com sucesso',
    });
  } catch {
    return res.status(400).json({
      error: 'Não foi possível atualizar o aluno.',
    });
  }
};

const deleteAluno = async (req, res) => {
  const { id } = req.params;

  const aluno = await Aluno.findByPk(id);

  if (!aluno) {
    return res.status(404).json({
      error: 'Aluno não encontrado',
    });
  }
  await aluno.destroy();
  return res.status(200).json({
    message: 'Aluno deletado com sucesso',
  });
};
export { getAlunos, createAluno, updateAluno, deleteAluno };
