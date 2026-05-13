import express from 'express';
import {
  getHabilidades,
  getIdHabilidade,
  createHabilidade,
  updateHabilidade,
  deleteHabilidade,
  getRelatorioHabilidades,
} from '../controllers/controllerHabilidade.js';
import { requireAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.get('/relatorio', getRelatorioHabilidades);
router.get('/', getHabilidades);
router.get('/:id', getIdHabilidade);
router.post('/', requireAdmin, createHabilidade);
router.put('/:id', requireAdmin, updateHabilidade);
router.delete('/:id', requireAdmin, deleteHabilidade);

export default router;
