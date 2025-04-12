import express from 'express';
import {
  getIndicators,
  getPatterns,
  getSignals,
  getSignal,
  createSignal,
  updateSignal,
  deleteSignal,
  getStrategies,
  getStrategy,
  createStrategy,
  updateStrategy,
  deleteStrategy,
  runBacktest,
  getBacktests,
  getBacktest
} from '../controllers/analysis.controller';
import { authenticate } from '../middleware/authenticate';

const router = express.Router();

// Các routes công khai
router.get('/indicators/:symbol', getIndicators);
router.get('/patterns/:symbol', getPatterns);
router.get('/signals', getSignals);

// Các routes yêu cầu xác thực
router.use(authenticate);

// Routes cho signals
router.route('/signals')
  .post(createSignal);

router.route('/signals/:id')
  .get(getSignal)
  .put(updateSignal)
  .delete(deleteSignal);

// Routes cho strategies
router.route('/strategies')
  .get(getStrategies)
  .post(createStrategy);

router.route('/strategies/:id')
  .get(getStrategy)
  .put(updateStrategy)
  .delete(deleteStrategy);

// Routes cho backtests
router.post('/backtest', runBacktest);
router.get('/backtests', getBacktests);
router.get('/backtests/:id', getBacktest);

export default router; 