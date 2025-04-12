import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  // Tạo ID duy nhất cho request
  const requestId = Math.random().toString(36).substring(2, 12);
  
  // Thời gian bắt đầu request
  const startTime = Date.now();
  
  // Log request đến
  logger.info(`[${requestId}] ${req.method} ${req.originalUrl} - Request received`, {
    requestId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    body: sanitizeRequestBody(req.body)
  });
  
  // Bắt sự kiện khi response được gửi
  res.on('finish', () => {
    // Tính thời gian xử lý
    const responseTime = Date.now() - startTime;
    
    // Phân loại log theo status code
    const logMethod = getLogMethodByStatusCode(res.statusCode);
    
    // Log response
    logMethod(`[${requestId}] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${responseTime}ms`, {
      requestId,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime
    });
  });
  
  next();
};

// Hàm làm sạch dữ liệu body để không log thông tin nhạy cảm
const sanitizeRequestBody = (body: any): any => {
  if (!body) return {};
  
  const sanitized = { ...body };
  
  // Danh sách các trường nhạy cảm cần ẩn đi
  const sensitiveFields = ['password', 'token', 'apiKey', 'apiSecret', 'secret', 'creditCard'];
  
  sensitiveFields.forEach(field => {
    if (field in sanitized) {
      sanitized[field] = '[REDACTED]';
    }
  });
  
  return sanitized;
};

// Lựa chọn phương thức log dựa vào status code
const getLogMethodByStatusCode = (statusCode: number): Function => {
  if (statusCode >= 500) {
    return logger.error.bind(logger);
  }
  
  if (statusCode >= 400) {
    return logger.warn.bind(logger);
  }
  
  return logger.info.bind(logger);
}; 