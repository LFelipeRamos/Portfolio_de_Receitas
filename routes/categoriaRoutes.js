import express from 'express';
import {
  getCategorias,
  getIdCategoria,
  createCategoria,
  editCategoria,
  deleteCategoria,
} from '../controllers/controllerCategoria.js';

const router = express.Router();

router.get('/', getCategorias);
router.get('/:id', getIdCategoria);
router.post('/', createCategoria);
router.put('/:id', editCategoria);
router.delete('/:id', deleteCategoria);

export default router;
