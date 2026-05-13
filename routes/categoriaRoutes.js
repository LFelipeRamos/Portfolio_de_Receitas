import express from 'express';
import {
  getCategorias,
  getIdCategoria,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from '../controllers/controllerCategoria.js';
import { requireAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getCategorias);
router.get('/:id', getIdCategoria);
router.post('/', requireAdmin, createCategoria);
router.put('/:id', requireAdmin, updateCategoria);
router.delete('/:id', requireAdmin, deleteCategoria);

export default router;
