import express from 'express';

import { authenticateAdmin } from '../middleware/authenticate.js';
import {
  getAllUsers,
  getUserBorrowStats,
  updateUserRole,
} from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', authenticateAdmin, getAllUsers);
router.get('/:id/borrows', authenticateAdmin, getUserBorrowStats);
router.put('/:id/role', authenticateAdmin, updateUserRole);

export default router;
