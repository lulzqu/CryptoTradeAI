import { Router } from 'express';
import { AlertController } from '../controllers/alert.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { body } from 'express-validator';
import { ValidationMiddleware } from '../middleware/validation.middleware';

const router = Router();
const alertController = new AlertController();

// Middleware để xác thực người dùng cho tất cả các routes
router.use(authMiddleware);

// Định nghĩa validation cho các request
const createAlertValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('type').isIn(['price', 'indicator', 'risk', 'system', 'custom']).withMessage('Invalid alert type'),
  body('symbol').notEmpty().withMessage('Symbol is required'),
  body('condition').isIn(['above', 'below', 'crosses_above', 'crosses_below', 'equals', 'custom']).withMessage('Invalid condition'),
  body('value').isNumeric().withMessage('Value must be a number'),
  body('message').notEmpty().withMessage('Message is required'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid priority')
];

const updateAlertValidation = [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('type').optional().isIn(['price', 'indicator', 'risk', 'system', 'custom']).withMessage('Invalid alert type'),
  body('symbol').optional().notEmpty().withMessage('Symbol cannot be empty'),
  body('condition').optional().isIn(['above', 'below', 'crosses_above', 'crosses_below', 'equals', 'custom']).withMessage('Invalid condition'),
  body('value').optional().isNumeric().withMessage('Value must be a number'),
  body('message').optional().notEmpty().withMessage('Message cannot be empty'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid priority'),
  body('status').optional().isIn(['active', 'disabled']).withMessage('Invalid status')
];

// Lấy tất cả alerts
router.get(
  '/',
  alertController.getAlerts.bind(alertController)
);

// Lấy alert theo ID
router.get(
  '/:id',
  alertController.getAlertById.bind(alertController)
);

// Tạo alert mới
router.post(
  '/',
  createAlertValidation,
  ValidationMiddleware.handleValidationErrors,
  alertController.createAlert.bind(alertController)
);

// Cập nhật alert
router.put(
  '/:id',
  updateAlertValidation,
  ValidationMiddleware.handleValidationErrors,
  alertController.updateAlert.bind(alertController)
);

// Xóa alert
router.delete(
  '/:id',
  alertController.deleteAlert.bind(alertController)
);

// Kích hoạt alert thủ công
router.post(
  '/:id/trigger',
  alertController.triggerAlert.bind(alertController)
);

// Xử lý tất cả alerts (admin only)
router.post(
  '/process',
  alertController.processAlerts.bind(alertController)
);

export default router; 