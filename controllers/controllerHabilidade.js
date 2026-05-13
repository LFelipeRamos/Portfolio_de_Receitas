import Habilidade from '../models/Habilidade.js';
import Aluno from '../models/Aluno.js';

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

const updateHabilidade = async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({
      error: 'Informe o nome da habilidade.',
    });
  }

  const habilidade = await Habilidade.findByPk(id);

  if (!habilidade) {
    return res.status(404).json({
      error: 'Habilidade não encontrada.',
    });
  }

  try {
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

const deleteHabilidade = async (req, res) => {
  const { id } = req.params;

  const habilidade = await Habilidade.findByPk(id);

  if (!habilidade) {
    return res.status(404).json({
      error: 'Habilidade não encontrada.',
    });
  }

  try {
    await habilidade.destroy();
    return res.status(200).json({
      message: 'Habilidade excluída com sucesso.',
    });
  } catch {
    return res.status(400).json({
      error: 'Não foi possível excluir a habilidade.',
    });
  }
};

const getRelatorioHabilidades = async (req, res) => {
  const totalAlunos = await Aluno.count();

  const habilidades = await Habilidade.findAll({
    include: Aluno,
    order: [['nome', 'ASC']],
  });

  const relatorio = habilidades.map((habilidade) => {
    const totalComHabilidade = habilidade.Alunos.length;

    return {
      id: habilidade.id,
      nome: habilidade.nome,
      total_alunos: totalComHabilidade,
      proporcao: totalAlunos === 0 ? 0 : totalComHabilidade / totalAlunos,
      percentual:
        totalAlunos === 0 ? 0 : (totalComHabilidade / totalAlunos) * 100,
    };
  });

  return res.status(200).json(relatorio);
};

export {
  getHabilidades,
  getIdHabilidade,
  createHabilidade,
  updateHabilidade,
  deleteHabilidade,
  getRelatorioHabilidades,
};
