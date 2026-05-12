import AlunoHabilidade from '../models/AlunoHabilidade';

const getAlunoHabilidades = async (req, res) => {
  const alunoHabilidade = await AlunoHabilidade.findAll();

  if (alunoHabilidade.length === 0) {
    return res.status(404).json({
      error: 'Habilidades do aluno não encontradas',
    });
  }
  return res.status(200).json(alunoHabilidade);
};

const getIdAlunoHabilidade = async (req, res) => {
  const { id } = req.params;

  const alunoHabilidade = await AlunoHabilidade.findByPk(id);

  if (!alunoHabilidade) {
    return res.status(404).json({
      error: 'Habilidade do aluno não encontrada.',
    });
  }
  return res.status(200).json(alunoHabilidade);
};

const createAlunoHabilidade = async (req, res) => {
  const { aluno_id, habilidade_id, nivel } = req.body;

  if (!aluno_id || !habilidade_id || !nivel) {
    return res.status(400).json({
      error: 'Informe o id do aluno, da habilidade e o nível.',
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
const editAlunoHabilidade = async (req, res) => {
  const { id } = req.params;
  const { aluno_id, habilidade_id, nivel } = req.body;

  if (!aluno_id || !habilidade_id || !nivel) {
    return res.status(400).json({
      error: 'Informe o aluno, a habilidade e o nível.',
    });
  }

  const alunoHabilidade = await AlunoHabilidade.findByPk(id);

  if (!alunoHabilidade) {
    return res.status(404).json({
      error: 'Habilidade do aluno não encontrada.',
    });
  }

  try {
    await alunoHabilidade.update({
      aluno_id,
      habilidade_id,
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
  const { id } = req.params;

  const alunoHabilidade = await AlunoHabilidade.findByPk(id);

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
  editAlunoHabilidade,
  deleteAlunoHabilidade,
  getIdAlunoHabilidade,
};
