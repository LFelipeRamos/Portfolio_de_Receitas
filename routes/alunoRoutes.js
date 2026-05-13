import express from 'express';
import {
  getAlunos,
  createAluno,
  editAluno,
  deleteAluno,
} from '../controllers/controllerAluno.js';

const router = express.Router();

router.get('/', getAlunos);
router.post('/', createAluno);
router.put('/:id', editAluno);
router.delete('/:id', deleteAluno);

export default router;
