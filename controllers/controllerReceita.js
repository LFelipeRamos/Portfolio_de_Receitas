import Receita from '../models/Receita.js';
import Categoria from '../models/Categoria.js';
import Aluno from '../models/Aluno.js';
import ReceitaCategoria from '../models/ReceitaCategoria.js';
import AlunoReceita from '../models/AlunoReceita.js';

const getReceitas = async (req, res) => {
  const receita = await Receita.findAll({
    include: [
      Categoria,
      {
        model: Aluno,
        attributes: ['id', 'nome', 'email', 'is_admin'],
      },
    ],
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
    include: [
      Categoria,
      {
        model: Aluno,
        attributes: ['id', 'nome', 'email', 'is_admin'],
      },
    ],
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
      {
        model: Aluno,
        attributes: ['id', 'nome', 'email', 'is_admin'],
      },
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
    const categoriasSelecionadas = [...new Set(categorias || [])];
    const alunosResponsaveis = [...new Set(alunos || [])];

    if (!nome || !descricao || !link_externo) {
      return res.status(400).json({
        error: 'Informe nome, descrição e link externo.',
      });
    }

    if (!Array.isArray(categorias) || categoriasSelecionadas.length === 0) {
      return res.status(400).json({
        error: 'Informe pelo menos uma categoria.',
      });
    }

    if (
      !req.session.aluno.is_admin &&
      !alunosResponsaveis.includes(req.session.aluno.id)
    ) {
      alunosResponsaveis.push(req.session.aluno.id);
    }

    if (alunosResponsaveis.length === 0) {
      return res.status(400).json({
        error: 'Informe pelo menos um aluno responsável.',
      });
    }

    const totalCategorias = await Categoria.count({
      where: {
        id: categoriasSelecionadas,
      },
    });

    if (totalCategorias !== categoriasSelecionadas.length) {
      return res.status(400).json({
        error: 'Uma ou mais categorias informadas não existem.',
      });
    }

    const totalAlunos = await Aluno.count({
      where: {
        id: alunosResponsaveis,
      },
    });

    if (totalAlunos !== alunosResponsaveis.length) {
      return res.status(400).json({
        error: 'Um ou mais alunos responsáveis não existem.',
      });
    }

    // cria receita
    const receita = await Receita.create({
      nome,
      descricao,
      link_externo,
    });

    // categorias
    for (const categoriaId of categoriasSelecionadas) {
      await ReceitaCategoria.create({
        receita_id: receita.id,
        categoria_id: categoriaId,
      });
    }

    // alunos
    for (const alunoId of alunosResponsaveis) {
      await AlunoReceita.create({
        receita_id: receita.id,
        aluno_id: alunoId,
        criador: alunoId === req.session.aluno.id,
      });
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

const updateReceita = async (req, res) => {
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
      const categoriasSelecionadas = [...new Set(categorias)];

      if (categoriasSelecionadas.length === 0) {
        return res.status(400).json({
          error: 'Informe pelo menos uma categoria.',
        });
      }

      const totalCategorias = await Categoria.count({
        where: {
          id: categoriasSelecionadas,
        },
      });

      if (totalCategorias !== categoriasSelecionadas.length) {
        return res.status(400).json({
          error: 'Uma ou mais categorias informadas não existem.',
        });
      }

      await ReceitaCategoria.destroy({
        where: {
          receita_id: receita.id,
        },
      });

      for (const categoriaId of categoriasSelecionadas) {
        await ReceitaCategoria.create({
          receita_id: receita.id,
          categoria_id: categoriaId,
        });
      }
    }

    if (Array.isArray(alunos)) {
      const alunosResponsaveis = [...new Set(alunos)];

      if (alunosResponsaveis.length === 0) {
        return res.status(400).json({
          error: 'Informe pelo menos um aluno responsável.',
        });
      }

      const totalAlunos = await Aluno.count({
        where: {
          id: alunosResponsaveis,
        },
      });

      if (totalAlunos !== alunosResponsaveis.length) {
        return res.status(400).json({
          error: 'Um ou mais alunos responsáveis não existem.',
        });
      }

      await AlunoReceita.destroy({
        where: {
          receita_id: receita.id,
        },
      });

      for (const alunoId of alunosResponsaveis) {
        await AlunoReceita.create({
          receita_id: receita.id,
          aluno_id: alunoId,
        });
      }
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
  updateReceita,
  deleteReceita,
};
