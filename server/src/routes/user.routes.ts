import express from 'express';
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateProfile,
  updateApiKeys,
  updateSettings
} from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/authenticate';

const router = express.Router();

// Middleware xác thực cho tất cả các routes
router.use(authenticate);

// Routes cho admin
router.route('/')
  .get(authorize('admin'), getUsers);

router.route('/:id')
  .get(authorize('admin'), getUser)
  .put(authorize('admin'), updateUser)
  .delete(authorize('admin'), deleteUser);

// Routes cho người dùng
router.put('/profile', updateProfile);
router.put('/api-keys', updateApiKeys);
router.put('/settings', updateSettings);

export default router; 