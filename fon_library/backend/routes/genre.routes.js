import express from 'express';

import {
  createGenre,
  deleteGenre,
  getAllGenres,
  getGenreById,
  updateGenre,
} from '../controllers/genre.controller.js';
import { authenticateAdmin } from '../middleware/authenticate.js';

const router = express.Router();

router.get('/', getAllGenres);
router.get('/:id', getGenreById);

router.post('/', authenticateAdmin, createGenre);
router.put('/:id', authenticateAdmin, updateGenre);
router.delete('/:id', authenticateAdmin, deleteGenre);

export default router;
