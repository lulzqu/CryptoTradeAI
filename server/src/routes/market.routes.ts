import express from 'express';
import {
  getMarketData,
  getCandles,
  getSymbols,
  getOrderBook,
  getMarketTrades
} from '../controllers/market.controller';
import { authenticate } from '../middleware/authenticate';

const router = express.Router();

// Routes công khai
router.get('/symbols', getSymbols);
router.get('/data/:symbol', getMarketData);
router.get('/candles/:symbol', getCandles);

// Routes yêu cầu xác thực
router.use(authenticate);
router.get('/orderbook/:symbol', getOrderBook);
router.get('/trades/:symbol', getMarketTrades);

export default router; 