import { Request, Response, NextFunction } from 'express';
import winston from 'winston';
import { config } from '../config';

// Tạo logger
const logger = winston.createLogger({
  level: config.logging.level,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Nếu không phải môi trường production, log ra console
if (config.app.env !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Middleware log request
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
  });

  next();
};

// Middleware log error
export const errorLogger = (error: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error({
    error: error.message,
    stack: error.stack,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  next(error);
};

// Middleware log uncaught exception
export const uncaughtExceptionLogger = (error: Error) => {
  logger.error({
    error: error.message,
    stack: error.stack,
    type: 'uncaughtException'
  });
};

// Middleware log unhandled rejection
export const unhandledRejectionLogger = (reason: any, promise: Promise<any>) => {
  logger.error({
    reason,
    promise,
    type: 'unhandledRejection'
  });
}; 