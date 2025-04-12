import express from 'express';
import {
  register,
  verifyEmail,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/authenticate';

const router = express.Router();

// Public routes
router.post('/register', register);
router.get('/verify-email/:token', verifyEmail);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);

// Protected routes
router.get('/me', authenticate, getMe);
router.put('/update-password', authenticate, updatePassword);

export default router; 