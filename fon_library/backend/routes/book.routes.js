import express from 'express';

import {
  createBook,
  deleteBook,
  getAllBooks,
  getAllBooksNoFilters,
  getBookById,
  getTopAvailableBooks,
  updateBook,
} from '../controllers/book.controller.js';
import { authenticateAdmin } from '../middleware/authenticate.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', getAllBooks);
router.get('/all', getAllBooksNoFilters);
router.get('/top-available', getTopAvailableBooks);
router.get('/:id', getBookById);

router.post('/', authenticateAdmin, upload.single('cover'), createBook);
router.put('/:id', authenticateAdmin, upload.single('cover'), updateBook);
router.delete('/:id', authenticateAdmin, deleteBook);

export default router;
