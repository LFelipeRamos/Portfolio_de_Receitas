import Habilidade from '../models/Habilidade';

const getHabilidades = async (req, res) => {
  const habilidade = await Habilidade.findAll({
    order: [['nome', 'ASC']],
  });

  if (habilidade.length === 0) {
    return res.status(404).json({
      error: 'Habilidades não encontradas',
    });
  }
  return res.status(200).json(habilidade);
};

const getIdHabilidade = async (req, res) => {
  const { id } = req.params;
  const habilidade = await Habilidade.findByPk(id);

  if (!habilidade) {
    return res.status(404).json({
      error: 'Habilidade não encontrada',
    });
  }
  return res.status(200).json(habilidade);
};

const createHabilidade = async (req, res) => {
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({
      error: 'Informe o nome da habilidade.',
    });
  }

  try {
    const habilidade = await Habilidade.create({
      nome,
    });

    return res.status(201).json({
      habilidade,
    });
  } catch {
    return res.status(400).json({
      error: 'Não foi possível salvar a habilidade.',
    });
  }
};

const editHabilidade = async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({
      error: 'Informe o nome da habilidade.',
    });
  }

  try {
    const habilidade = await Habilidade.findByPk(id);

    if (!habilidade) {
      return res.status(404).json({
        error: 'Habilidade não encontrada.',
      });
    }

    habilidade.nome = nome;
    await habilidade.update({ nome });
    return res.status(200).json({
      message: 'Habilidade atualizada com sucesso',
    });
  } catch {
    return res.status(400).json({
      error: 'Não foi possível atualizar a habilidade.',
    });
  }
};

export { getHabilidades, getIdHabilidade, createHabilidade, editHabilidade };
