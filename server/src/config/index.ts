import dotenv from 'dotenv';

// Tải biến môi trường từ file .env
dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/crypto-trade-ai',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiration: process.env.JWT_EXPIRATION || '1d',
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  apiKey: process.env.API_KEY || 'test-api-key',
  apiBaseUrl: process.env.API_BASE_URL || 'https://api.example.com',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  emailFrom: process.env.EMAIL_FROM || 'noreply@example.com',
  smtpHost: process.env.SMTP_HOST,
  smtpPort: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  logLevel: process.env.LOG_LEVEL || 'info',
};

export default config; 