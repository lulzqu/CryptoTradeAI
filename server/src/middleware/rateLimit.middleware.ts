import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { logger } from '../utils/logger';

// Thêm type declaration cho logger nếu chưa có
declare module '../utils/logger' {
  export const logger: {
    warn: (message: string) => void;
    error: (message: string) => void;
  };
}

export class RateLimitMiddleware {
  // Giới hạn số lần truy cập chung
  static generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 100, // Giới hạn 100 yêu cầu
    standardHeaders: true, // Trả về thông tin giới hạn trong header
    legacyHeaders: false, // Tắt header cũ
    handler: (req: Request, res: Response) => {
      logger.warn(`Quá giới hạn truy cập: ${req.ip}`);
      res.status(429).json({
        success: false,
        message: 'Quá nhiều yêu cầu, vui lòng thử lại sau'
      });
    }
  });

  // Giới hạn đăng nhập
  static loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 5, // Giới hạn 5 lần đăng nhập
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
      logger.warn(`Quá giới hạn đăng nhập: ${req.ip}`);
      res.status(429).json({
        success: false,
        message: 'Quá nhiều lần đăng nhập, vui lòng thử lại sau'
      });
    }
  });

  // Giới hạn đăng ký
  static registrationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 giờ
    max: 3, // Giới hạn 3 lần đăng ký
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
      logger.warn(`Quá giới hạn đăng ký: ${req.ip}`);
      res.status(429).json({
        success: false,
        message: 'Quá nhiều lần đăng ký, vui lòng thử lại sau'
      });
    }
  });

  // Giới hạn giao dịch
  static tradingLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 phút
    max: 10, // Giới hạn 10 giao dịch
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
      logger.warn(`Quá giới hạn giao dịch: ${req.ip}`);
      res.status(429).json({
        success: false,
        message: 'Quá nhiều giao dịch, vui lòng thử lại sau'
      });
    }
  });

  // Middleware tùy chỉnh
  static createCustomLimiter(
    windowMs: number, 
    max: number, 
    message?: string
  ) {
    return rateLimit({
      windowMs,
      max,
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req: Request, res: Response) => {
        logger.warn(`Quá giới hạn truy cập tùy chỉnh: ${req.ip}`);
        res.status(429).json({
          success: false,
          message: message || 'Quá nhiều yêu cầu, vui lòng thử lại sau'
        });
      }
    });
  }
} 