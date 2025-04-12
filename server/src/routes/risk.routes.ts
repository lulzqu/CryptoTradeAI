import { Router } from 'express';
import { RiskController } from '../controllers/risk.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { riskSchema } from '../schemas/risk.schema';

const router = Router();
const riskController = new RiskController();

// Kiểm tra rủi ro giao dịch
router.post(
  '/check-trade',
  authMiddleware,
  validateRequest(riskSchema.checkTrade),
  riskController.checkTradeRisk.bind(riskController)
);

// Kiểm tra rủi ro portfolio
router.get(
  '/check-portfolio/:portfolioId',
  authMiddleware,
  riskController.checkPortfolioRisk.bind(riskController)
);

// Kiểm tra rủi ro chiến lược
router.get(
  '/check-strategy/:strategyId',
  authMiddleware,
  riskController.checkStrategyRisk.bind(riskController)
);

// Lấy chỉ số rủi ro
router.get(
  '/metrics',
  authMiddleware,
  riskController.getRiskMetrics.bind(riskController)
);

// Cập nhật cài đặt rủi ro
router.put(
  '/settings',
  authMiddleware,
  validateRequest(riskSchema.updateSettings),
  riskController.updateRiskSettings.bind(riskController)
);

// Lấy cảnh báo rủi ro
router.get(
  '/alerts',
  authMiddleware,
  riskController.getRiskAlerts.bind(riskController)
);

// Lấy lịch sử rủi ro
router.get(
  '/history',
  authMiddleware,
  validateRequest(riskSchema.getHistory),
  riskController.getRiskHistory.bind(riskController)
);

// Lấy tổng quan rủi ro
router.get(
  '/summary',
  authMiddleware,
  riskController.getRiskSummary.bind(riskController)
);

// Lấy mức độ rủi ro
router.get(
  '/exposure',
  authMiddleware,
  riskController.getRiskExposure.bind(riskController)
);

// Lấy giới hạn rủi ro
router.get(
  '/limits',
  authMiddleware,
  riskController.getRiskLimits.bind(riskController)
);

export default router; 