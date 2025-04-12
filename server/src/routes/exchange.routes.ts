import { Router } from 'express';
import { ExchangeController } from '../controllers/exchange.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { exchangeSchema } from '../schemas/exchange.schema';

const router = Router();
const exchangeController = new ExchangeController();

// Tạo exchange mới
router.post(
  '/',
  authMiddleware,
  validateRequest(exchangeSchema.create),
  exchangeController.createExchange.bind(exchangeController)
);

// Lấy exchange theo ID
router.get(
  '/:id',
  authMiddleware,
  exchangeController.getExchange.bind(exchangeController)
);

// Lấy tất cả exchange của người dùng
router.get(
  '/',
  authMiddleware,
  exchangeController.getExchanges.bind(exchangeController)
);

// Cập nhật exchange
router.put(
  '/:id',
  authMiddleware,
  validateRequest(exchangeSchema.update),
  exchangeController.updateExchange.bind(exchangeController)
);

// Xóa exchange
router.delete(
  '/:id',
  authMiddleware,
  exchangeController.deleteExchange.bind(exchangeController)
);

// Đồng bộ exchange
router.post(
  '/:id/sync',
  authMiddleware,
  exchangeController.syncExchange.bind(exchangeController)
);

// Kiểm tra kết nối exchange
router.post(
  '/test-connection',
  authMiddleware,
  validateRequest(exchangeSchema.testConnection),
  exchangeController.testExchangeConnection.bind(exchangeController)
);

// Lấy số dư exchange
router.get(
  '/:id/balance',
  authMiddleware,
  exchangeController.getExchangeBalance.bind(exchangeController)
);

// Lấy danh sách orders của exchange
router.get(
  '/:id/orders',
  authMiddleware,
  exchangeController.getExchangeOrders.bind(exchangeController)
);

// Lấy danh sách positions của exchange
router.get(
  '/:id/positions',
  authMiddleware,
  exchangeController.getExchangePositions.bind(exchangeController)
);

export default router; 