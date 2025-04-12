import { Request, Response, NextFunction } from 'express';
import { validationResult, body, param, query, ValidationError } from 'express-validator';

// Thêm type declaration cho logger
declare module '../utils/logger' {
  export const logger: {
    warn: (message: string) => void;
    error: (message: string) => void;
  };
}

// Import logger một cách an toàn
const logger = {
  warn: (message: string) => {
    try {
      const loggerModule = require('../utils/logger');
      if (loggerModule && loggerModule.logger) {
        loggerModule.logger.warn(message);
      } else {
        console.warn(message);
      }
    } catch (error) {
      console.warn(message);
    }
  },
  error: (message: string) => {
    try {
      const loggerModule = require('../utils/logger');
      if (loggerModule && loggerModule.logger) {
        loggerModule.logger.error(message);
      } else {
        console.error(message);
      }
    } catch (error) {
      console.error(message);
    }
  }
};

export class ValidationMiddleware {
  // Xử lý lỗi validation
  static handleValidationErrors(
    req: Request, 
    res: Response, 
    next: NextFunction
  ) {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      logger.warn(`Lỗi validation: ${JSON.stringify(errors.array())}`);
      
      return res.status(400).json({
        success: false,
        errors: errors.array().map((err: ValidationError) => ({
          field: err.param,
          message: err.msg
        }))
      });
    }
    
    next();
  }

  // Validation cho đăng ký người dùng
  static registerValidation = [
    body('email')
      .isEmail()
      .withMessage('Email không hợp lệ')
      .normalizeEmail(),
    
    body('password')
      .isLength({ min: 8 })
      .withMessage('Mật khẩu phải có ít nhất 8 ký tự')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      .withMessage('Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt'),
    
    body('name')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Tên phải từ 2-50 ký tự')
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage('Tên chỉ chứa chữ cái và khoảng trắng')
  ];

  // Validation cho cập nhật thông tin người dùng
  static updateUserValidation = [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Tên phải từ 2-50 ký tự')
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage('Tên chỉ chứa chữ cái và khoảng trắng'),
    
    body('email')
      .optional()
      .isEmail()
      .withMessage('Email không hợp lệ')
      .normalizeEmail(),
    
    body('phone')
      .optional()
      .isMobilePhone('vi-VN')
      .withMessage('Số điện thoại không hợp lệ')
  ];

  // Validation cho API keys
  static apiKeyValidation = [
    body('name')
      .trim()
      .isLength({ min: 3, max: 50 })
      .withMessage('Tên API key phải từ 3-50 ký tự'),
    
    body('exchange')
      .isIn(['MEXC', 'BINANCE', 'KUCOIN'])
      .withMessage('Sàn giao dịch không hợp lệ'),
    
    body('apiKey')
      .trim()
      .notEmpty()
      .withMessage('API key không được để trống'),
    
    body('apiSecret')
      .trim()
      .notEmpty()
      .withMessage('API secret không được để trống')
  ];

  // Validation cho cài đặt thông báo
  static notificationSettingsValidation = [
    body('email')
      .optional()
      .isBoolean()
      .withMessage('Cài đặt email phải là giá trị boolean'),
    
    body('push')
      .optional()
      .isBoolean()
      .withMessage('Cài đặt push notification phải là giá trị boolean'),
    
    body('types')
      .optional()
      .isArray()
      .withMessage('Loại thông báo phải là mảng')
  ];

  // Validation cho tín hiệu giao dịch
  static signalValidation = [
    body('symbol')
      .trim()
      .notEmpty()
      .withMessage('Mã giao dịch không được để trống')
      .matches(/^[A-Z]{3,10}$/)
      .withMessage('Mã giao dịch không hợp lệ'),
    
    body('type')
      .isIn(['BUY', 'SELL', 'HOLD'])
      .withMessage('Loại tín hiệu không hợp lệ'),
    
    body('entryPrice')
      .isFloat({ min: 0 })
      .withMessage('Giá vào phải là số dương'),
    
    body('stopLoss')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Điểm dừng lỗ phải là số dương'),
    
    body('takeProfit')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Điểm chốt lời phải là số dương')
  ];

  // Validation cho chiến lược giao dịch
  static strategyValidation = [
    body('name')
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage('Tên chiến lược phải từ 3-100 ký tự'),
    
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Mô tả không được vượt quá 500 ký tự'),
    
    body('indicators')
      .optional()
      .isArray()
      .withMessage('Các chỉ báo phải là mảng'),
    
    body('riskManagement.stopLoss')
      .optional()
      .isFloat({ min: 0, max: 1 })
      .withMessage('Tỷ lệ dừng lỗ phải từ 0-1'),
    
    body('riskManagement.takeProfit')
      .optional()
      .isFloat({ min: 0, max: 1 })
      .withMessage('Tỷ lệ chốt lời phải từ 0-1')
  ];

  // Validation cho xuất danh mục
  static exportPortfolioValidation = [
    query('type')
      .isIn(['pdf', 'csv'])
      .withMessage('Loại xuất không hợp lệ'),
    
    query('startDate')
      .optional()
      .isISO8601()
      .withMessage('Ngày bắt đầu không hợp lệ'),
    
    query('endDate')
      .optional()
      .isISO8601()
      .withMessage('Ngày kết thúc không hợp lệ')
  ];

  // Validation cho chia sẻ tín hiệu
  static shareSignalValidation = [
    body('signalId')
      .isMongoId()
      .withMessage('ID tín hiệu không hợp lệ'),
    
    body('sharedWith')
      .isArray()
      .withMessage('Danh sách người dùng được chia sẻ phải là mảng'),
    
    body('type')
      .isIn(['PUBLIC', 'PRIVATE', 'FOLLOWERS'])
      .withMessage('Loại chia sẻ không hợp lệ'),
    
    body('message')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Tin nhắn không được vượt quá 500 ký tự')
  ];
} 