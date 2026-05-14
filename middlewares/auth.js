import Aluno from '../models/Aluno.js';
import AlunoReceita from '../models/AlunoReceita.js';

const requireLogin = (req, res, next) => {
  if (!req.session.aluno) {
    return res.status(401).json({
      error: 'Faça login para acessar esta rota.',
    });
  }

  return next();
};

const requireAdmin = (req, res, next) => {
  if (!req.session.aluno || !req.session.aluno.is_admin) {
    return res.status(403).json({
      error: 'Apenas administradores podem acessar esta rota.',
    });
  }

  return next();
};

const requireAdminOrFirstAluno = async (req, res, next) => {
  const totalAlunos = await Aluno.count();

  if (totalAlunos === 0) {
    return next();
  }

  return requireAdmin(req, res, next);
};

const requireReceitaResponsavel = async (req, res, next) => {
  if (!req.session.aluno) {
    return res.status(401).json({
      error: 'Faça login para acessar esta rota.',
    });
  }

  if (req.session.aluno.is_admin) {
    return next();
  }

  const alunoReceita = await AlunoReceita.findOne({
    where: {
      aluno_id: req.session.aluno.id,
      receita_id: req.params.id,
    },
  });

  if (!alunoReceita) {
    return res.status(403).json({
      error: 'Você não é responsável por esta receita.',
    });
  }

  return next();
};

const requireAlunoHabilidadeDono = (req, res, next) => {
  if (!req.session.aluno) {
    return res.status(401).json({
      error: 'Faça login para acessar esta rota.',
    });
  }

  if (req.session.aluno.is_admin) {
    return next();
  }

  const alunoId = Number(req.params.alunoId || req.body.aluno_id);

  if (alunoId !== req.session.aluno.id) {
    return res.status(403).json({
      error: 'Você só pode alterar suas próprias habilidades.',
    });
  }

  return next();
};

export {
  requireLogin,
  requireAdmin,
  requireAdminOrFirstAluno,
  requireReceitaResponsavel,
  requireAlunoHabilidadeDono,
};
