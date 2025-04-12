import express from 'express';
import { 
  getPositions, 
  createPosition, 
  updatePosition, 
  closePosition,
  getPositionById,
  deletePosition,
  getPositionStats
} from '../controllers/position.controller';
import { protect } from '../middleware/authMiddleware';
import { 
  validateCreatePosition, 
  validateUpdatePosition,
  validateClosePosition,
  validatePositionQuery
} from '../middleware/validationMiddleware';

const router = express.Router();

// @desc    Lấy danh sách vị thế
// @route   GET /api/positions
// @access  Private
router.get(
  '/', 
  protect, 
  validatePositionQuery,
  getPositions
);

// @desc    Lấy chi tiết vị thế theo ID
// @route   GET /api/positions/:id
// @access  Private
router.get(
  '/:id', 
  protect, 
  getPositionById
);

// @desc    Tạo vị thế mới
// @route   POST /api/positions
// @access  Private
router.post(
  '/', 
  protect, 
  validateCreatePosition,
  createPosition
);

// @desc    Cập nhật vị thế
// @route   PUT /api/positions/:id
// @access  Private
router.put(
  '/:id', 
  protect, 
  validateUpdatePosition,
  updatePosition
);

// @desc    Đóng vị thế
// @route   POST /api/positions/:id/close
// @access  Private
router.post(
  '/:id/close', 
  protect, 
  validateClosePosition,
  closePosition
);

// @desc    Xóa vị thế
// @route   DELETE /api/positions/:id
// @access  Private
router.delete(
  '/:id', 
  protect, 
  deletePosition
);

// @desc    Lấy thống kê vị thế
// @route   GET /api/positions/stats
// @access  Private
router.get(
  '/stats', 
  protect, 
  getPositionStats
);

export default router; 