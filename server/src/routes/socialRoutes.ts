import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  shareStrategy,
  getPublicStrategies,
  addComment,
  addRating,
  followStrategy,
  updatePerformance
} from '../controllers/socialController';

const router = express.Router();

// Chia sẻ chiến lược
router.post('/share', authenticate, shareStrategy);

// Lấy danh sách chiến lược công khai
router.get('/public', getPublicStrategies);

// Thêm bình luận
router.post('/:strategyShareId/comment', authenticate, addComment);

// Thêm đánh giá
router.post('/:strategyShareId/rating', authenticate, addRating);

// Theo dõi chiến lược
router.post('/:strategyShareId/follow', authenticate, followStrategy);

// Cập nhật hiệu suất
router.put('/:strategyShareId/performance', authenticate, updatePerformance);

export default router; 