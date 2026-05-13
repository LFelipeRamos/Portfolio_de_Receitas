import express from 'express';
import {
  getHabilidades,
  getIdHabilidade,
  createHabilidade,
  getRelatorioHabilidades,
} from '../controllers/controllerHabilidade.js';

const router = express.Router();

router.get('/relatorio', getRelatorioHabilidades);
router.get('/', getHabilidades);
router.get('/:id', getIdHabilidade);
router.post('/', createHabilidade);

export default router;
