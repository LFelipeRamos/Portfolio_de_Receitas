import express from 'express';
import {
  getComentarios,
  createComentario,
} from '../controllers/controllerComentario.js';

const router = express.Router();

router.get('/receita/:receitaId', getComentarios);
router.post('/', createComentario);

export default router;
