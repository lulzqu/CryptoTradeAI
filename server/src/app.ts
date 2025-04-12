import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import config from './config';
import notificationRoutes from './routes/notification.routes';
import downloadRoutes from './routes/download';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: config.clientUrl,
  credentials: true
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/notifications', notificationRoutes);
app.use('/api/download', downloadRoutes);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Có lỗi xảy ra trên máy chủ',
    error: config.nodeEnv === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});

export default app; 