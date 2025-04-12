import { Router } from 'express';
import { SignalController } from '../controllers/signal.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { signalSchema } from '../schemas/signal.schema';

const router = Router();
const signalController = new SignalController();

// Tạo signal mới
router.post(
  '/',
  authMiddleware,
  validateRequest(signalSchema.create),
  signalController.createSignal.bind(signalController)
);

// Lấy signal theo ID
router.get(
  '/:id',
  authMiddleware,
  signalController.getSignal.bind(signalController)
);

// Lấy tất cả signal của người dùng
router.get(
  '/',
  authMiddleware,
  signalController.getSignals.bind(signalController)
);

// Lấy signal theo chiến lược
router.get(
  '/strategy/:strategyId',
  authMiddleware,
  signalController.getSignalsByStrategy.bind(signalController)
);

// Lấy signal theo symbol
router.get(
  '/symbol/:symbol',
  authMiddleware,
  signalController.getSignalsBySymbol.bind(signalController)
);

// Cập nhật signal
router.put(
  '/:id',
  authMiddleware,
  validateRequest(signalSchema.update),
  signalController.updateSignal.bind(signalController)
);

// Xóa signal
router.delete(
  '/:id',
  authMiddleware,
  signalController.deleteSignal.bind(signalController)
);

// Kích hoạt signal
router.post(
  '/:id/trigger',
  authMiddleware,
  signalController.triggerSignal.bind(signalController)
);

// Hủy signal
router.post(
  '/:id/cancel',
  authMiddleware,
  signalController.cancelSignal.bind(signalController)
);

// Hết hạn signal
router.post(
  '/:id/expire',
  authMiddleware,
  signalController.expireSignal.bind(signalController)
);

// Lấy signal đang hoạt động
router.get(
  '/active',
  authMiddleware,
  signalController.getActiveSignals.bind(signalController)
);

// Lấy signal đã kích hoạt
router.get(
  '/triggered',
  authMiddleware,
  signalController.getTriggeredSignals.bind(signalController)
);

// Lấy signal đã hết hạn
router.get(
  '/expired',
  authMiddleware,
  signalController.getExpiredSignals.bind(signalController)
);

// Lấy signal theo timeframe
router.get(
  '/timeframe/:timeframe',
  authMiddleware,
  signalController.getSignalsByTimeframe.bind(signalController)
);

// Lấy signal theo loại
router.get(
  '/type/:type',
  authMiddleware,
  signalController.getSignalsByType.bind(signalController)
);

export default router; 