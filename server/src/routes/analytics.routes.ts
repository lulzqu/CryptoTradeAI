import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { analyticsSchema } from '../schemas/analytics.schema';

const router = Router();
const analyticsController = new AnalyticsController();

// Lấy phân tích giao dịch
router.get(
  '/trades',
  authMiddleware,
  validateRequest(analyticsSchema.getTradeAnalytics),
  analyticsController.getTradeAnalytics.bind(analyticsController)
);

// Lấy phân tích chiến lược
router.get(
  '/strategies',
  authMiddleware,
  validateRequest(analyticsSchema.getStrategyAnalytics),
  analyticsController.getStrategyAnalytics.bind(analyticsController)
);

// Lấy phân tích portfolio
router.get(
  '/portfolios',
  authMiddleware,
  validateRequest(analyticsSchema.getPortfolioAnalytics),
  analyticsController.getPortfolioAnalytics.bind(analyticsController)
);

// Lấy phân tích thị trường
router.get(
  '/market',
  authMiddleware,
  validateRequest(analyticsSchema.getMarketAnalytics),
  analyticsController.getMarketAnalytics.bind(analyticsController)
);

// Lấy phân tích rủi ro
router.get(
  '/risk',
  authMiddleware,
  validateRequest(analyticsSchema.getRiskAnalytics),
  analyticsController.getRiskAnalytics.bind(analyticsController)
);

// Lấy phân tích người dùng
router.get(
  '/users',
  authMiddleware,
  validateRequest(analyticsSchema.getUserAnalytics),
  analyticsController.getUserAnalytics.bind(analyticsController)
);

// Lấy chỉ số hiệu suất
router.get(
  '/performance',
  authMiddleware,
  validateRequest(analyticsSchema.getPerformanceMetrics),
  analyticsController.getPerformanceMetrics.bind(analyticsController)
);

// Lấy phân tích tương quan
router.get(
  '/correlation',
  authMiddleware,
  validateRequest(analyticsSchema.getCorrelationAnalysis),
  analyticsController.getCorrelationAnalysis.bind(analyticsController)
);

// Lấy phân tích biến động
router.get(
  '/volatility',
  authMiddleware,
  validateRequest(analyticsSchema.getVolatilityAnalysis),
  analyticsController.getVolatilityAnalysis.bind(analyticsController)
);

// Lấy tâm lý thị trường
router.get(
  '/sentiment',
  authMiddleware,
  validateRequest(analyticsSchema.getMarketSentiment),
  analyticsController.getMarketSentiment.bind(analyticsController)
);

export default router; 