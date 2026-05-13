import express from 'express';

import {
  getReceitas,
  getIdReceita,
  getReceitasPorCategoria,
  createReceita,
  updateReceita,
  deleteReceita,
} from '../controllers/controllerReceita.js';
import {
  requireLogin,
  requireReceitaResponsavel,
} from '../middlewares/auth.js';

const router = express.Router();

// GET ALL
router.get('/', getReceitas);

// GET BY ID
router.get('/categoria/:categoriaId', getReceitasPorCategoria);

// GET BY ID
router.get('/:id', getIdReceita);

// CREATE
router.post('/', requireLogin, createReceita);

// UPDATE
router.put('/:id', requireReceitaResponsavel, updateReceita);

// DELETE
router.delete('/:id', requireReceitaResponsavel, deleteReceita);

export default router;
