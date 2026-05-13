import express from 'express';

import {
  getReceitas,
  getIdReceita,
  getReceitasPorCategoria,
  createReceita,
  editReceita,
  deleteReceita,
} from '../controllers/controllerReceita.js';

const router = express.Router();

// GET ALL
router.get('/', getReceitas);

// GET BY ID
router.get('/categoria/:categoriaId', getReceitasPorCategoria);

// GET BY ID
router.get('/:id', getIdReceita);

// CREATE
router.post('/', createReceita);

// UPDATE
router.put('/:id', editReceita);

// DELETE
router.delete('/:id', deleteReceita);

export default router;
