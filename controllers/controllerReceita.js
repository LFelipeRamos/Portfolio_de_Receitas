import Receita from '../models/Receita.js';
import Categoria from '../models/Categoria.js';
import Aluno from '../models/Aluno.js';

const getReceitas = async (req, res) => {
  const receita = await Receita.findAll({
    order: [['nome', 'ASC']],
  });

  if (receita.length === 0) {
    return res.status(404).json({
      error: 'Receitas não encontradas',
    });
  }

  return res.status(200).json(receita);
};

const getIdReceita = async (req, res) => {
  const { id } = req.params;
  const receita = await Receita.findByPk(id);

  if (!receita) {
    return res.status(404).json({
      error: 'Receita não encontrada',
    });
  }
  return res.status(200).json(receita);
};

const createReceita = async (req, res) => {
  try {
    const { nome, descricao, link_externo, categorias, alunos } = req.body;

    // cria receita
    const receita = await Receita.create({
      nome,
      descricao,
      link_externo,
    });

    // categorias
    const categoriasEncontradas = await Categoria.findAll({
      where: {
        id: categorias,
      },
    });

    await receita.addCategorias(categoriasEncontradas);

    // alunos
    const alunosEncontrados = await Aluno.findAll({
      where: {
        id: alunos,
      },
    });

    await receita.addAlunos(alunosEncontrados);

    return res.status(201).json({
      message: 'Receita criada com sucesso',
      receita,
    });
  } catch (err) {
    return res.status(400).json({
      error: err.message,
    });
  }
};
const editReceita = async (req, res) => {
  const { id } = req.params;
  const { nome, categoria_id, descricao, link_externo } = req.body;

  const receita = await Receita.findByPk(id);

  if (!receita) {
    return res.status(404).json({
      error: 'Receita não encontrada',
    });
  }

  try {
    await receita.update({
      nome,
      categoria_id,
      descricao,
      link_externo,
    });

    return res.status(200).json({
      message: 'Receita atualizada com sucesso',
    });
  } catch {
    return res.status(400).json({
      error: 'Não foi possível atualizar a receita.',
    });
  }
};
const deleteReceita = async (req, res) => {
  const { id } = req.params;

  const receita = await Receita.findByPk(id);

  if (!receita) {
    return res.status(404).json({
      error: 'Receita não encontrada',
    });
  }

  try {
    await receita.destroy();

    return res.status(200).json({
      message: 'Receita deletada com sucesso',
    });
  } catch {
    return res.status(400).json({
      error: 'Não foi possível deletar a receita.',
    });
  }
};

export { getReceitas, getIdReceita, createReceita, editReceita, deleteReceita };
