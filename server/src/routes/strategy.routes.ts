import { Router } from 'express';
import { StrategyController } from '../controllers/strategy.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { strategySchema } from '../schemas/strategy.schema';

const router = Router();
const strategyController = new StrategyController();

// Tạo chiến lược mới
router.post(
  '/',
  authMiddleware,
  validateRequest(strategySchema.create),
  strategyController.createStrategy.bind(strategyController)
);

// Lấy chiến lược theo ID
router.get(
  '/:id',
  authMiddleware,
  strategyController.getStrategy.bind(strategyController)
);

// Lấy tất cả chiến lược của người dùng
router.get(
  '/',
  authMiddleware,
  strategyController.getStrategies.bind(strategyController)
);

// Cập nhật chiến lược
router.put(
  '/:id',
  authMiddleware,
  validateRequest(strategySchema.update),
  strategyController.updateStrategy.bind(strategyController)
);

// Xóa chiến lược
router.delete(
  '/:id',
  authMiddleware,
  strategyController.deleteStrategy.bind(strategyController)
);

// Chạy chiến lược
router.post(
  '/:id/run',
  authMiddleware,
  strategyController.runStrategy.bind(strategyController)
);

// Kiểm tra chiến lược
router.post(
  '/test',
  authMiddleware,
  validateRequest(strategySchema.test),
  strategyController.testStrategy.bind(strategyController)
);

// Tối ưu hóa chiến lược
router.post(
  '/:id/optimize',
  authMiddleware,
  validateRequest(strategySchema.optimize),
  strategyController.optimizeStrategy.bind(strategyController)
);

// Lấy chiến lược công khai
router.get(
  '/public',
  authMiddleware,
  strategyController.getPublicStrategies.bind(strategyController)
);

// Sao chép chiến lược
router.post(
  '/:id/duplicate',
  authMiddleware,
  strategyController.duplicateStrategy.bind(strategyController)
);

export default router; 