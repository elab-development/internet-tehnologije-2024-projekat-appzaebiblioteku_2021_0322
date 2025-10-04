import express from 'express';
import {
  getNewYorkTimesTopBooks,
  getTopBooks,
  getTopGenres,
  getTopUsers,
} from '../controllers/reports.controller.js';
import { authenticateAdmin } from '../middleware/authenticate.js';

const router = express.Router();

router.get('/top-books', authenticateAdmin, getTopBooks);
router.get('/top-genres', authenticateAdmin, getTopGenres);
router.get('/top-users', authenticateAdmin, getTopUsers);
router.get(
  '/new-york-times-top-books',
  authenticateAdmin,
  getNewYorkTimesTopBooks
);

export default router;
