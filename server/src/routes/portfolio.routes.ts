import { Router } from 'express';
import { PortfolioController } from '../controllers/portfolio.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { portfolioSchema } from '../schemas/portfolio.schema';

const router = Router();
const portfolioController = new PortfolioController();

// Tạo portfolio mới
router.post(
  '/',
  authMiddleware,
  validateRequest(portfolioSchema.create),
  portfolioController.createPortfolio.bind(portfolioController)
);

// Lấy portfolio theo ID
router.get(
  '/:id',
  authMiddleware,
  portfolioController.getPortfolio.bind(portfolioController)
);

// Lấy tất cả portfolio của người dùng
router.get(
  '/',
  authMiddleware,
  portfolioController.getPortfolios.bind(portfolioController)
);

// Cập nhật portfolio
router.put(
  '/:id',
  authMiddleware,
  validateRequest(portfolioSchema.update),
  portfolioController.updatePortfolio.bind(portfolioController)
);

// Xóa portfolio
router.delete(
  '/:id',
  authMiddleware,
  portfolioController.deletePortfolio.bind(portfolioController)
);

// Thêm chiến lược vào portfolio
router.post(
  '/:id/strategies',
  authMiddleware,
  validateRequest(portfolioSchema.addStrategy),
  portfolioController.addStrategy.bind(portfolioController)
);

// Xóa chiến lược khỏi portfolio
router.delete(
  '/:id/strategies/:strategyId',
  authMiddleware,
  portfolioController.removeStrategy.bind(portfolioController)
);

// Cập nhật trọng số chiến lược
router.put(
  '/:id/strategies/:strategyId/weight',
  authMiddleware,
  validateRequest(portfolioSchema.updateStrategyWeight),
  portfolioController.updateStrategyWeight.bind(portfolioController)
);

// Cập nhật trạng thái chiến lược
router.put(
  '/:id/strategies/:strategyId/status',
  authMiddleware,
  validateRequest(portfolioSchema.updateStrategyStatus),
  portfolioController.updateStrategyStatus.bind(portfolioController)
);

// Tính toán metrics portfolio
router.get(
  '/:id/metrics',
  authMiddleware,
  portfolioController.calculatePortfolioMetrics.bind(portfolioController)
);

// Cân bằng lại portfolio
router.post(
  '/:id/rebalance',
  authMiddleware,
  portfolioController.rebalancePortfolio.bind(portfolioController)
);

export default router; 