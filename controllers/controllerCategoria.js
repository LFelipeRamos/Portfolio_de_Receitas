import Categoria from '../models/Categoria.js';

//bora ler
const getCategorias = async (req, res) => {
  const categoria = await Categoria.findAll({
    order: [['nome', 'ASC']],
  });

  if (categoria.length === 0) {
    return res.status(404).json({
      error: 'Categorias não encontradas',
    });
  }
  return res.status(200).json(categoria);
};

const getIdCategoria = async (req, res) => {
  const { id } = req.params;
  const categoria = await Categoria.findByPk(id);

  if (!categoria) {
    return res.status(404).json({
      error: 'Categoria não encontrada',
    });
  }
  return res.status(200).json(categoria);
};

const createCategoria = async (req, res) => {
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({
      error: 'Informe o nome da categoria.',
    });
  }

  try {
    const categoria = await Categoria.create({
      nome,
    });

    return res.status(201).json({
      categoria,
    });
  } catch {
    return res.status(400).json({
      error: 'Não foi possível salvar a categoria.',
    });
  }
};

const editCategoria = async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({
      error: 'Informe o nome da categoria.',
    });
  }

  const categoria = await Categoria.findByPk(id);

  if (!categoria) {
    return res.status(404).json({
      error: 'Categoria não encontrada',
    });
  }

  try {
    await categoria.update({ nome });
    return res.status(200).json({
      message: 'Categoria atualizada com sucesso',
    });
  } catch {
    return res.status(400).json({
      error: 'Não foi possível atualizar a categoria.',
    });
  }
};

const deleteCategoria = async (req, res) => {
  const { id } = req.params;

  const categoria = await Categoria.findByPk(id);

  if (!categoria) {
    return res.status(404).json({
      error: 'Categoria não encontrada',
    });
  }

  try {
    await categoria.destroy();
    return res.status(200).json({
      message: 'Categoria excluída com sucesso.',
    });
  } catch {
    return res.status(400).json({
      error: 'Não foi possível excluir a categoria.',
    });
  }
};

export {
  getCategorias,
  getIdCategoria,
  createCategoria,
  editCategoria,
  deleteCategoria,
};
