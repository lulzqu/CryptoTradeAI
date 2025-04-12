import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';
import { config } from '../config';

// Tạo Redis client
const redisClient = createClient({
  url: config.redis.url,
  password: config.redis.password
});

// Kết nối Redis
redisClient.connect().catch(console.error);

// Tạo rate limiter cho API
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // Giới hạn 100 request mỗi IP trong 15 phút
  standardHeaders: true, // Trả về thông tin rate limit trong headers
  legacyHeaders: false, // Không sử dụng headers cũ
  store: new RedisStore({
    client: redisClient,
    prefix: 'rate-limit:',
    // Tự động reset sau khi hết hạn
    resetExpiryOnChange: true
  }),
  message: {
    status: 429,
    message: 'Quá nhiều request từ IP này, vui lòng thử lại sau 15 phút'
  }
});

// Tạo rate limiter cho authentication
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 giờ
  max: 5, // Giới hạn 5 lần đăng nhập thất bại mỗi IP trong 1 giờ
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    client: redisClient,
    prefix: 'auth-limit:',
    resetExpiryOnChange: true
  }),
  message: {
    status: 429,
    message: 'Quá nhiều lần đăng nhập thất bại, vui lòng thử lại sau 1 giờ'
  }
});

// Tạo rate limiter cho trading
export const tradingLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 phút
  max: 30, // Giới hạn 30 request mỗi IP trong 1 phút
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    client: redisClient,
    prefix: 'trading-limit:',
    resetExpiryOnChange: true
  }),
  message: {
    status: 429,
    message: 'Quá nhiều request giao dịch, vui lòng thử lại sau 1 phút'
  }
});

// Middleware kiểm tra rate limit cho API
export const checkApiRateLimit = (req: Request, res: Response, next: NextFunction) => {
  apiLimiter(req, res, next);
};

// Middleware kiểm tra rate limit cho authentication
export const checkAuthRateLimit = (req: Request, res: Response, next: NextFunction) => {
  authLimiter(req, res, next);
};

// Middleware kiểm tra rate limit cho trading
export const checkTradingRateLimit = (req: Request, res: Response, next: NextFunction) => {
  tradingLimiter(req, res, next);
}; 