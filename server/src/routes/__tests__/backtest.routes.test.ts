import request from 'supertest';
import express from 'express';
import { backtestRoutes } from '../backtest.routes';
import { authMiddleware } from '../../middleware/auth.middleware';

// Mock auth middleware
jest.mock('../../middleware/auth.middleware', () => ({
  authMiddleware: jest.fn((req, res, next) => next())
}));

describe('Backtest Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/backtests', backtestRoutes);
  });

  describe('POST /api/backtests', () => {
    it('should create a backtest', async () => {
      const backtestData = {
        strategyId: 'strategy1',
        symbol: 'BTC/USDT',
        timeframe: '1h'
      };

      const response = await request(app)
        .post('/api/backtests')
        .send(backtestData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toMatchObject(backtestData);
    });

    it('should handle invalid backtest data', async () => {
      const invalidData = {
        strategyId: '',
        symbol: '',
        timeframe: ''
      };

      const response = await request(app)
        .post('/api/backtests')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/backtests/:id', () => {
    it('should get a backtest by id', async () => {
      const response = await request(app)
        .get('/api/backtests/backtest1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id', 'backtest1');
    });

    it('should handle non-existent backtest', async () => {
      const response = await request(app)
        .get('/api/backtests/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/backtests/user/:userId', () => {
    it('should get backtests by user', async () => {
      const response = await request(app)
        .get('/api/backtests/user/user1');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should handle non-existent user', async () => {
      const response = await request(app)
        .get('/api/backtests/user/nonexistent');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('DELETE /api/backtests/:id', () => {
    it('should delete a backtest', async () => {
      const response = await request(app)
        .delete('/api/backtests/backtest1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });

    it('should handle non-existent backtest', async () => {
      const response = await request(app)
        .delete('/api/backtests/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/backtests/run', () => {
    it('should run a backtest', async () => {
      const backtestRequest = {
        strategyId: 'strategy1',
        symbol: 'BTC/USDT',
        timeframe: '1h',
        startDate: '2023-01-01',
        endDate: '2023-01-31',
        initialBalance: 1000
      };

      const response = await request(app)
        .post('/api/backtests/run')
        .send(backtestRequest);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toMatchObject(backtestRequest);
    });

    it('should handle invalid backtest request', async () => {
      const invalidRequest = {
        strategyId: '',
        symbol: '',
        timeframe: '',
        startDate: '2023-01-31',
        endDate: '2023-01-01',
        initialBalance: 0
      };

      const response = await request(app)
        .post('/api/backtests/run')
        .send(invalidRequest);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Authentication', () => {
    it('should require authentication for all routes', async () => {
      // Mock auth middleware to throw error
      (authMiddleware as jest.Mock).mockImplementationOnce((req, res, next) => {
        next(new Error('Unauthorized'));
      });

      const routes = [
        { method: 'post', path: '/api/backtests' },
        { method: 'get', path: '/api/backtests/backtest1' },
        { method: 'get', path: '/api/backtests/user/user1' },
        { method: 'delete', path: '/api/backtests/backtest1' },
        { method: 'post', path: '/api/backtests/run' }
      ];

      for (const route of routes) {
        const response = await request(app)[route.method](route.path);
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error', 'Unauthorized');
      }
    });
  });
}); 