import express, { Express, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { WebSocketService } from './services/websocket';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { authenticate } from './middleware/authenticate';

// Routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import marketRoutes from './routes/market.routes';
import portfolioRoutes from './routes/portfolio.routes';
import analysisRoutes from './routes/analysis.routes';
import settingsRoutes from './routes/settings.routes';
import autoTradingRoutes from './routes/autoTrading.routes';
import positionRoutes from './routes/position.routes';
import alertRoutes from './routes/alert.routes';

// Middleware
import { logger } from './utils/logger';

// Initialize environment variables
dotenv.config();

// Initialize Express app
const app: Express = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: config.security.cors.origin,
    methods: config.security.cors.methods,
    credentials: true
  }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
  origin: config.security.cors.origin,
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit(config.security.rateLimit);
app.use(limiter);

// Custom middleware
app.use(requestLogger);

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', authenticate, userRoutes);
app.use('/api/v1/market', marketRoutes);
app.use('/api/v1/portfolio', authenticate, portfolioRoutes);
app.use('/api/v1/analysis', analysisRoutes);
app.use('/api/v1/settings', authenticate, settingsRoutes);
app.use('/api/v1/auto-trading', autoTradingRoutes);
app.use('/api/v1/positions', authenticate, positionRoutes);
app.use('/api/v1/alerts', authenticate, alertRoutes);

// Base route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'CryptoTradeAI API is running' });
});

// Health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// Error handler
app.use(errorHandler);

// 404 route
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

// Initialize WebSocket server
import WebSocketServer from './socket';
const webSocketServer = new WebSocketServer(httpServer);

// Socket.IO connection basic handler
io.on('connection', (socket) => {
  logger.info('Client connected to basic Socket.IO:', socket.id);

  socket.on('disconnect', () => {
    logger.info('Client disconnected from basic Socket.IO:', socket.id);
  });
});

// Start server
const start = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.database.url);
    logger.info('MongoDB Connected');

    // Start HTTP server
    httpServer.listen(config.app.port, () => {
      logger.info(`Server running in ${config.app.env} mode on port ${config.app.port}`);
    });

    // Initialize WebSocket
    WebSocketService.getInstance(httpServer);
  } catch (error) {
    logger.error('Error starting server:', error);
  }
};

start();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  logger.error(`Error: ${err.message}`);
  // Close server & exit process
  httpServer.close(() => process.exit(1));
});

// Handle shutdown
process.on('SIGINT', () => {
  logger.info('Shutting down server...');
  httpServer.close(() => {
    logger.info('Server closed');
    mongoose.connection.close(false, () => {
      logger.info('MongoDB connection closed');
      process.exit(0);
    });
  });
});

export { app, io, webSocketServer }; 