import { Router } from 'express';
import { BacktestController } from '../controllers/backtest.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const controller = new BacktestController();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Create a new backtest
router.post('/', controller.createBacktest.bind(controller));

// Get a specific backtest
router.get('/:id', controller.getBacktest.bind(controller));

// Get all backtests for a user
router.get('/user/:userId', controller.getBacktestsByUser.bind(controller));

// Delete a backtest
router.delete('/:id', controller.deleteBacktest.bind(controller));

// Run a backtest
router.post('/run', controller.runBacktest.bind(controller));

export const backtestRoutes = router; 