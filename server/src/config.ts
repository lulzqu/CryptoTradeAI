import dotenv from 'dotenv';

dotenv.config();

export const config = {
  app: {
    name: 'CryptoTradeAI',
    url: process.env.APP_URL || 'http://localhost:3000',
    port: parseInt(process.env.PORT || '3000'),
    env: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },
  database: {
    url: process.env.MONGODB_URI || 'mongodb://admin:admin123@mongodb:27017/cryptotradeai?authSource=admin',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  mexc: {
    apiKey: process.env.MEXC_API_KEY || '',
    apiSecret: process.env.MEXC_API_SECRET || '',
    baseUrl: 'https://api.mexc.com/api/v3'
  },
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASSWORD || '',
    from: process.env.EMAIL_FROM || 'noreply@cryptotradeai.com'
  },
  websocket: {
    port: parseInt(process.env.WS_PORT || '8080')
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log'
  },
  monitoring: {
    enabled: process.env.MONITORING_ENABLED === 'true',
    interval: parseInt(process.env.MONITORING_INTERVAL || '60000')
  },
  security: {
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
      max: parseInt(process.env.RATE_LIMIT_MAX || '100')
    },
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:8000',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }
  }
}; 