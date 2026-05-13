import express from 'express';
import {
  getAlunos,
  createAluno,
  updateAluno,
  deleteAluno,
} from '../controllers/controllerAluno.js';
import { requireAdmin, requireAdminOrFirstAluno } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', requireAdmin, getAlunos);
router.post('/', requireAdminOrFirstAluno, createAluno);
router.put('/:id', requireAdmin, updateAluno);
router.delete('/:id', requireAdmin, deleteAluno);

export default router;
