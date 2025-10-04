import express from 'express';

import {
  authenticateAdmin,
  authenticateUser,
} from '../middleware/authenticate.js';
import {
  checkIfBookBorrowed,
  createBorrow,
  getAllBorrows,
  getUserBorrows,
  markAsOverdue,
  returnBorrow,
} from '../controllers/borrow.controller.js';

const router = express.Router();

router.post('/', authenticateUser, createBorrow);

router.get('/', authenticateAdmin, getAllBorrows);
router.get('/my', authenticateUser, getUserBorrows);
router.get('/check/:bookId', authenticateUser, checkIfBookBorrowed);

router.put('/:id/return', authenticateUser, returnBorrow);
router.put('/:id/overdue', authenticateAdmin, markAsOverdue);

export default router;
