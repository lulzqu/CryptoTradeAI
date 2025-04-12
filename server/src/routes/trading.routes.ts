import { Router } from 'express';
import { TradingController } from '../controllers/trading.controller';
import { TradingService } from '../services/trading.service';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { tradingSchema } from '../schemas/trading.schema';

const router = Router();
const tradingService = new TradingService();
const tradingController = new TradingController(tradingService);

// Apply auth middleware to all routes
router.use(authMiddleware);

// Position routes
router.post('/positions', tradingController.createPosition.bind(tradingController));
router.put('/positions/:positionId', tradingController.updatePosition.bind(tradingController));
router.post('/positions/:positionId/close', tradingController.closePosition.bind(tradingController));
router.get('/positions/open', tradingController.getOpenPositions.bind(tradingController));
router.get('/positions/closed', tradingController.getClosedPositions.bind(tradingController));

// Signal routes
router.post('/signals', tradingController.createSignal.bind(tradingController));
router.get('/signals', tradingController.getSignals.bind(tradingController));

// Order routes
router.post(
  '/orders',
  validateRequest(tradingSchema.createOrder),
  tradingController.createOrder.bind(tradingController)
);

router.get(
  '/orders/:id',
  tradingController.getOrder.bind(tradingController)
);

router.get(
  '/orders',
  tradingController.getOrders.bind(tradingController)
);

router.put(
  '/orders/:id',
  validateRequest(tradingSchema.updateOrder),
  tradingController.updateOrder.bind(tradingController)
);

router.delete(
  '/orders/:id',
  tradingController.cancelOrder.bind(tradingController)
);

// Trade routes
router.post(
  '/trades',
  validateRequest(tradingSchema.createTrade),
  tradingController.createTrade.bind(tradingController)
);

router.get(
  '/trades/:id',
  tradingController.getTrade.bind(tradingController)
);

router.get(
  '/trades',
  tradingController.getTrades.bind(tradingController)
);

router.put(
  '/trades/:id',
  validateRequest(tradingSchema.updateTrade),
  tradingController.updateTrade.bind(tradingController)
);

router.post(
  '/trades/:id/close',
  validateRequest(tradingSchema.closeTrade),
  tradingController.closeTrade.bind(tradingController)
);

// Additional trade routes
router.get(
  '/trades/open',
  tradingController.getOpenTrades.bind(tradingController)
);

router.get(
  '/trades/closed',
  tradingController.getClosedTrades.bind(tradingController)
);

router.get(
  '/trades/strategy/:strategyId',
  tradingController.getTradesByStrategy.bind(tradingController)
);

router.get(
  '/trades/symbol/:symbol',
  tradingController.getTradesBySymbol.bind(tradingController)
);

export default router; 