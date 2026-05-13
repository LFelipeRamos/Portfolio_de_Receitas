import Comentario from '../models/Comentario.js';

async function getComentarios(req, res) {
  const { receitaId } = req.params;

  const comentarios = await Comentario.find({
    receita_id: receitaId,
  });

  return res.status(200).json(comentarios);
}

async function createComentario(req, res) {
  const { receita_id, nome, texto } = req.body;

  if (!receita_id || !nome || !texto) {
    return res.status(400).json({
      error: 'Informe receita, nome e comentário.',
    });
  }

  try {
    const comentario = await Comentario.create({
      receita_id,
      nome,
      texto,
    });

    return res.status(201).json(comentario);
  } catch {
    return res.status(400).json({
      error: 'Não foi possível salvar o comentário.',
    });
  }
}

export { getComentarios, createComentario };
