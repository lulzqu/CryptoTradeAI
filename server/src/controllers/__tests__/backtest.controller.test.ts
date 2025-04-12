import { Request, Response } from 'express';
import { BacktestController } from '../backtest.controller';
import { BacktestService } from '../../services/backtest.service';
import { Backtest } from '../../models/backtest.model';

// Mock BacktestService
jest.mock('../../services/backtest.service');
const MockBacktestService = BacktestService as jest.Mocked<typeof BacktestService>;

describe('BacktestController', () => {
  let controller: BacktestController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    controller = new BacktestController();
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('createBacktest', () => {
    it('should create a backtest successfully', async () => {
      const mockBacktest: Partial<Backtest> = {
        strategyId: 'strategy1',
        symbol: 'BTC/USDT',
        timeframe: '1h'
      };

      mockRequest.body = mockBacktest;
      mockRequest.user = { id: 'user1' };

      const createdBacktest = {
        _id: 'backtest1',
        ...mockBacktest,
        userId: 'user1'
      };

      MockBacktestService.createBacktest.mockResolvedValueOnce(createdBacktest as Backtest);

      await controller.createBacktest(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(MockBacktestService.createBacktest).toHaveBeenCalledWith({
        ...mockBacktest,
        userId: 'user1'
      });
      expect(mockResponse.json).toHaveBeenCalledWith(createdBacktest);
    });

    it('should handle create backtest error', async () => {
      const mockBacktest: Partial<Backtest> = {
        strategyId: 'strategy1',
        symbol: 'BTC/USDT',
        timeframe: '1h'
      };

      mockRequest.body = mockBacktest;
      mockRequest.user = { id: 'user1' };

      const error = new Error('Failed to create backtest');
      MockBacktestService.createBacktest.mockRejectedValueOnce(error);

      await controller.createBacktest(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getBacktest', () => {
    it('should get a backtest successfully', async () => {
      const mockBacktest: Backtest = {
        _id: 'backtest1',
        userId: 'user1',
        strategyId: 'strategy1',
        symbol: 'BTC/USDT',
        timeframe: '1h',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-01-31'),
        initialBalance: 1000,
        finalBalance: 1200,
        totalTrades: 10,
        winningTrades: 6,
        losingTrades: 4,
        winRate: 0.6,
        profitFactor: 1.5,
        maxDrawdown: 0.1,
        sharpeRatio: 1.2,
        sortinoRatio: 1.3,
        trades: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockRequest.params = { id: 'backtest1' };

      MockBacktestService.getBacktestById.mockResolvedValueOnce(mockBacktest);

      await controller.getBacktest(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(MockBacktestService.getBacktestById).toHaveBeenCalledWith('backtest1');
      expect(mockResponse.json).toHaveBeenCalledWith(mockBacktest);
    });

    it('should handle get backtest error', async () => {
      mockRequest.params = { id: 'backtest1' };

      const error = new Error('Failed to get backtest');
      MockBacktestService.getBacktestById.mockRejectedValueOnce(error);

      await controller.getBacktest(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getBacktestsByUser', () => {
    it('should get backtests by user successfully', async () => {
      const mockBacktests: Backtest[] = [
        {
          _id: 'backtest1',
          userId: 'user1',
          strategyId: 'strategy1',
          symbol: 'BTC/USDT',
          timeframe: '1h',
          startDate: new Date('2023-01-01'),
          endDate: new Date('2023-01-31'),
          initialBalance: 1000,
          finalBalance: 1200,
          totalTrades: 10,
          winningTrades: 6,
          losingTrades: 4,
          winRate: 0.6,
          profitFactor: 1.5,
          maxDrawdown: 0.1,
          sharpeRatio: 1.2,
          sortinoRatio: 1.3,
          trades: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      mockRequest.params = { userId: 'user1' };

      MockBacktestService.getBacktestsByUser.mockResolvedValueOnce(mockBacktests);

      await controller.getBacktestsByUser(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(MockBacktestService.getBacktestsByUser).toHaveBeenCalledWith('user1');
      expect(mockResponse.json).toHaveBeenCalledWith(mockBacktests);
    });

    it('should handle get backtests by user error', async () => {
      mockRequest.params = { userId: 'user1' };

      const error = new Error('Failed to get backtests');
      MockBacktestService.getBacktestsByUser.mockRejectedValueOnce(error);

      await controller.getBacktestsByUser(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteBacktest', () => {
    it('should delete a backtest successfully', async () => {
      mockRequest.params = { id: 'backtest1' };

      MockBacktestService.deleteBacktest.mockResolvedValueOnce(true);

      await controller.deleteBacktest(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(MockBacktestService.deleteBacktest).toHaveBeenCalledWith('backtest1');
      expect(mockResponse.json).toHaveBeenCalledWith({ success: true });
    });

    it('should handle delete backtest error', async () => {
      mockRequest.params = { id: 'backtest1' };

      const error = new Error('Failed to delete backtest');
      MockBacktestService.deleteBacktest.mockRejectedValueOnce(error);

      await controller.deleteBacktest(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('runBacktest', () => {
    it('should run a backtest successfully', async () => {
      const mockBacktestRequest = {
        strategyId: 'strategy1',
        symbol: 'BTC/USDT',
        timeframe: '1h',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-01-31'),
        initialBalance: 1000
      };

      const mockBacktestResult: Backtest = {
        _id: 'backtest1',
        userId: 'user1',
        ...mockBacktestRequest,
        finalBalance: 1200,
        totalTrades: 10,
        winningTrades: 6,
        losingTrades: 4,
        winRate: 0.6,
        profitFactor: 1.5,
        maxDrawdown: 0.1,
        sharpeRatio: 1.2,
        sortinoRatio: 1.3,
        trades: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockRequest.body = mockBacktestRequest;
      mockRequest.user = { id: 'user1' };

      MockBacktestService.runBacktest.mockResolvedValueOnce(mockBacktestResult);

      await controller.runBacktest(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(MockBacktestService.runBacktest).toHaveBeenCalledWith({
        ...mockBacktestRequest,
        userId: 'user1'
      });
      expect(mockResponse.json).toHaveBeenCalledWith(mockBacktestResult);
    });

    it('should handle run backtest error', async () => {
      const mockBacktestRequest = {
        strategyId: 'strategy1',
        symbol: 'BTC/USDT',
        timeframe: '1h',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-01-31'),
        initialBalance: 1000
      };

      mockRequest.body = mockBacktestRequest;
      mockRequest.user = { id: 'user1' };

      const error = new Error('Failed to run backtest');
      MockBacktestService.runBacktest.mockRejectedValueOnce(error);

      await controller.runBacktest(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
}); 