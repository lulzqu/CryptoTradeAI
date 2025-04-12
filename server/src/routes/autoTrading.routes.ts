import express from 'express';
import {
  createStrategy,
  getStrategies,
  getStrategy,
  updateStrategy,
  deleteStrategy,
  toggleStrategy,
  executeStrategy
} from '../controllers/autoTrading.controller';
import { authenticate } from '../middleware/authenticate';

const router = express.Router();

// Tất cả các routes đều yêu cầu xác thực
router.use(authenticate);

// Routes cho chiến lược giao dịch tự động
router.route('/strategies')
  .get(getStrategies)
  .post(createStrategy);

router.route('/strategies/:id')
  .get(getStrategy)
  .put(updateStrategy)
  .delete(deleteStrategy);

router.route('/strategies/:id/toggle')
  .put(toggleStrategy);

router.route('/strategies/:id/execute')
  .post(executeStrategy);

export default router; 