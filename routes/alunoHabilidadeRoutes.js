import express from 'express';
import {
  getAlunoHabilidades,
  getIdAlunoHabilidade,
  createAlunoHabilidade,
  updateAlunoHabilidade,
  deleteAlunoHabilidade,
} from '../controllers/controllerAlunoHabilidade.js';
import {
  requireLogin,
  requireAlunoHabilidadeDono,
} from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getAlunoHabilidades);
router.get('/:alunoId/:habilidadeId', getIdAlunoHabilidade);
router.post(
  '/',
  requireLogin,
  requireAlunoHabilidadeDono,
  createAlunoHabilidade,
);
router.put(
  '/:alunoId/:habilidadeId',
  requireLogin,
  requireAlunoHabilidadeDono,
  updateAlunoHabilidade,
);
router.delete(
  '/:alunoId/:habilidadeId',
  requireLogin,
  requireAlunoHabilidadeDono,
  deleteAlunoHabilidade,
);

export default router;
