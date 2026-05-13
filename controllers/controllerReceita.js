import Receita from '../models/Receita.js';
import Categoria from '../models/Categoria.js';
import Aluno from '../models/Aluno.js';

const getReceitas = async (req, res) => {
  const receita = await Receita.findAll({
    include: [Categoria, Aluno],
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
  const receita = await Receita.findByPk(id, {
    include: [Categoria, Aluno],
  });

  if (!receita) {
    return res.status(404).json({
      error: 'Receita não encontrada',
    });
  }
  return res.status(200).json(receita);
};

const getReceitasPorCategoria = async (req, res) => {
  const { categoriaId } = req.params;

  const receitas = await Receita.findAll({
    include: [
      {
        model: Categoria,
        where: {
          id: categoriaId,
        },
      },
      Aluno,
    ],
    order: [['nome', 'ASC']],
  });

  if (receitas.length === 0) {
    return res.status(404).json({
      error: 'Receitas não encontradas para essa categoria',
    });
  }

  return res.status(200).json(receitas);
};

const createReceita = async (req, res) => {
  try {
    const { nome, descricao, link_externo, categorias, alunos } = req.body;

    if (!nome || !descricao || !link_externo) {
      return res.status(400).json({
        error: 'Informe nome, descrição e link externo.',
      });
    }

    // cria receita
    const receita = await Receita.create({
      nome,
      descricao,
      link_externo,
    });

    // categorias
    if (Array.isArray(categorias) && categorias.length > 0) {
      const categoriasEncontradas = await Categoria.findAll({
        where: {
          id: categorias,
        },
      });

      await receita.addCategoria(categoriasEncontradas);
    }

    // alunos
    if (Array.isArray(alunos) && alunos.length > 0) {
      const alunosEncontrados = await Aluno.findAll({
        where: {
          id: alunos,
        },
      });

      await receita.addAlunos(alunosEncontrados);
    }

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
  const { nome, descricao, link_externo, categorias, alunos } = req.body;

  const receita = await Receita.findByPk(id);

  if (!receita) {
    return res.status(404).json({
      error: 'Receita não encontrada',
    });
  }

  try {
    const dadosAtualizados = {};

    if (nome !== undefined) {
      dadosAtualizados.nome = nome;
    }

    if (descricao !== undefined) {
      dadosAtualizados.descricao = descricao;
    }

    if (link_externo !== undefined) {
      dadosAtualizados.link_externo = link_externo;
    }

    await receita.update(dadosAtualizados);

    if (Array.isArray(categorias)) {
      const categoriasEncontradas = await Categoria.findAll({
        where: {
          id: categorias,
        },
      });

      await receita.setCategoria(categoriasEncontradas);
    }

    if (Array.isArray(alunos)) {
      const alunosEncontrados = await Aluno.findAll({
        where: {
          id: alunos,
        },
      });

      await receita.setAlunos(alunosEncontrados);
    }

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

export {
  getReceitas,
  getIdReceita,
  getReceitasPorCategoria,
  createReceita,
  editReceita,
  deleteReceita,
};
