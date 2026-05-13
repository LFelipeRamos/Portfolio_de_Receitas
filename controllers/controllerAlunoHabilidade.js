import AlunoHabilidade from '../models/AlunoHabilidade.js';

const getAlunoHabilidades = async (req, res) => {
  const where = {};

  if (!req.session.aluno.is_admin) {
    where.aluno_id = req.session.aluno.id;
  }

  const alunoHabilidade = await AlunoHabilidade.findAll({
    where,
  });

  if (alunoHabilidade.length === 0) {
    return res.status(404).json({
      error: 'Habilidades do aluno não encontradas',
    });
  }
  return res.status(200).json(alunoHabilidade);
};

const getIdAlunoHabilidade = async (req, res) => {
  const { alunoId, habilidadeId } = req.params;

  if (!req.session.aluno.is_admin && Number(alunoId) !== req.session.aluno.id) {
    return res.status(403).json({
      error: 'Você só pode visualizar suas próprias habilidades.',
    });
  }

  const alunoHabilidade = await AlunoHabilidade.findOne({
    where: {
      aluno_id: alunoId,
      habilidade_id: habilidadeId,
    },
  });

  if (!alunoHabilidade) {
    return res.status(404).json({
      error: 'Habilidade do aluno não encontrada.',
    });
  }
  return res.status(200).json(alunoHabilidade);
};

const createAlunoHabilidade = async (req, res) => {
  const { aluno_id, habilidade_id, nivel } = req.body;

  if (!aluno_id || !habilidade_id || nivel === undefined) {
    return res.status(400).json({
      error: 'Informe o id do aluno, da habilidade e o nível.',
    });
  }

  if (nivel < 0 || nivel > 10) {
    return res.status(400).json({
      error: 'O nível deve estar entre 0 e 10.',
    });
  }

  try {
    const alunoHabilidade = await AlunoHabilidade.create({
      aluno_id,
      habilidade_id,
      nivel,
    });

    return res.status(201).json({
      alunoHabilidade,
    });
  } catch {
    return res.status(400).json({
      error: 'Não foi possível salvar a habilidade do aluno.',
    });
  }
};

const updateAlunoHabilidade = async (req, res) => {
  const { alunoId, habilidadeId } = req.params;
  const { nivel } = req.body;

  if (nivel === undefined) {
    return res.status(400).json({
      error: 'Informe o nível.',
    });
  }

  if (nivel < 0 || nivel > 10) {
    return res.status(400).json({
      error: 'O nível deve estar entre 0 e 10.',
    });
  }

  const alunoHabilidade = await AlunoHabilidade.findOne({
    where: {
      aluno_id: alunoId,
      habilidade_id: habilidadeId,
    },
  });

  if (!alunoHabilidade) {
    return res.status(404).json({
      error: 'Habilidade do aluno não encontrada.',
    });
  }

  try {
    await alunoHabilidade.update({
      nivel,
    });

    return res.status(200).json({
      message: 'Habilidade do aluno atualizada com sucesso',
    });
  } catch {
    return res.status(400).json({
      error: 'Não foi possível atualizar a habilidade do aluno.',
    });
  }
};

const deleteAlunoHabilidade = async (req, res) => {
  const { alunoId, habilidadeId } = req.params;

  const alunoHabilidade = await AlunoHabilidade.findOne({
    where: {
      aluno_id: alunoId,
      habilidade_id: habilidadeId,
    },
  });

  if (!alunoHabilidade) {
    return res.status(404).json({
      error: 'Habilidade do aluno não encontrada.',
    });
  }

  try {
    await alunoHabilidade.destroy();

    return res.status(200).json({
      message: 'Habilidade do aluno deletada com sucesso',
    });
  } catch {
    return res.status(400).json({
      error: 'Não foi possível deletar a habilidade do aluno.',
    });
  }
};

export {
  getAlunoHabilidades,
  createAlunoHabilidade,
  updateAlunoHabilidade,
  deleteAlunoHabilidade,
  getIdAlunoHabilidade,
};
