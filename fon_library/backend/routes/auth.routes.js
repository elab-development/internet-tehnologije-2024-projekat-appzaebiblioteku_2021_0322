import express from 'express';

import {
  checkAuth,
  forgotPassword,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  verifyEmail,
} from '../controllers/auth.controller.js';
import { authenticateUser } from '../middleware/authenticate.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

router.get('/check-auth', authenticateUser, checkAuth);

router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

export default router;
