import winston from 'winston';
import path from 'path';

// Định nghĩa cấu hình logger
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(info => {
    const { timestamp, level, message, ...meta } = info;
    return `${timestamp} [${level.toUpperCase()}]: ${message} ${
      Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
    }`;
  })
);

// Tạo logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      )
    }),
    new winston.transports.File({ 
      filename: path.join('logs', 'error.log'), 
      level: 'error'
    }),
    new winston.transports.File({ 
      filename: path.join('logs', 'combined.log') 
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({ 
      filename: path.join('logs', 'exceptions.log')
    })
  ]
});

// Thêm stream cho Morgan (HTTP logging)
export const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  }
};

export { logger }; 