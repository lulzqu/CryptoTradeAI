import { BacktestService } from '../backtest.service';
import { Backtest } from '../../models/backtest.model';
import { BacktestMetrics } from '../../utils/backtestMetrics';

// Mock Backtest model
jest.mock('../../models/backtest.model');
const MockBacktest = Backtest as jest.Mocked<typeof Backtest>;

// Mock BacktestMetrics
jest.mock('../../utils/backtestMetrics');
const MockBacktestMetrics = BacktestMetrics as jest.Mocked<typeof BacktestMetrics>;

describe('BacktestService', () => {
  let service: BacktestService;

  beforeEach(() => {
    service = new BacktestService();
    jest.clearAllMocks();
  });

  describe('createBacktest', () => {
    it('should create a backtest successfully', async () => {
      const backtestData: Partial<Backtest> = {
        userId: 'user1',
        strategyId: 'strategy1',
        symbol: 'BTC/USDT',
        timeframe: '1h'
      };

      const mockBacktest = {
        _id: 'backtest1',
        ...backtestData
      };

      MockBacktest.create.mockResolvedValueOnce(mockBacktest as Backtest);

      const result = await service.createBacktest(backtestData);

      expect(MockBacktest.create).toHaveBeenCalledWith(backtestData);
      expect(result).toEqual(mockBacktest);
    });

    it('should handle create backtest error', async () => {
      const backtestData: Partial<Backtest> = {
        userId: 'user1',
        strategyId: 'strategy1',
        symbol: 'BTC/USDT',
        timeframe: '1h'
      };

      const error = new Error('Failed to create backtest');
      MockBacktest.create.mockRejectedValueOnce(error);

      await expect(service.createBacktest(backtestData)).rejects.toThrow('Failed to create backtest');
    });
  });

  describe('getBacktestById', () => {
    it('should get a backtest by id successfully', async () => {
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

      MockBacktest.findById.mockResolvedValueOnce(mockBacktest);

      const result = await service.getBacktestById('backtest1');

      expect(MockBacktest.findById).toHaveBeenCalledWith('backtest1');
      expect(result).toEqual(mockBacktest);
    });

    it('should handle get backtest by id error', async () => {
      const error = new Error('Failed to get backtest');
      MockBacktest.findById.mockRejectedValueOnce(error);

      await expect(service.getBacktestById('backtest1')).rejects.toThrow('Failed to get backtest');
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

      MockBacktest.find.mockResolvedValueOnce(mockBacktests);

      const result = await service.getBacktestsByUser('user1');

      expect(MockBacktest.find).toHaveBeenCalledWith({ userId: 'user1' });
      expect(result).toEqual(mockBacktests);
    });

    it('should handle get backtests by user error', async () => {
      const error = new Error('Failed to get backtests');
      MockBacktest.find.mockRejectedValueOnce(error);

      await expect(service.getBacktestsByUser('user1')).rejects.toThrow('Failed to get backtests');
    });
  });

  describe('deleteBacktest', () => {
    it('should delete a backtest successfully', async () => {
      MockBacktest.findByIdAndDelete.mockResolvedValueOnce(true);

      const result = await service.deleteBacktest('backtest1');

      expect(MockBacktest.findByIdAndDelete).toHaveBeenCalledWith('backtest1');
      expect(result).toBe(true);
    });

    it('should handle delete backtest error', async () => {
      const error = new Error('Failed to delete backtest');
      MockBacktest.findByIdAndDelete.mockRejectedValueOnce(error);

      await expect(service.deleteBacktest('backtest1')).rejects.toThrow('Failed to delete backtest');
    });
  });

  describe('runBacktest', () => {
    it('should run a backtest successfully', async () => {
      const backtestRequest = {
        userId: 'user1',
        strategyId: 'strategy1',
        symbol: 'BTC/USDT',
        timeframe: '1h',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-01-31'),
        initialBalance: 1000
      };

      const mockTrades = [
        {
          entryTime: new Date('2023-01-01'),
          exitTime: new Date('2023-01-02'),
          entryPrice: 100,
          exitPrice: 110,
          size: 1,
          type: 'long',
          profitLoss: 10,
          profitLossPercentage: 0.1
        }
      ];

      const mockMetrics = {
        finalBalance: 1100,
        totalTrades: 1,
        winningTrades: 1,
        losingTrades: 0,
        winRate: 1,
        profitFactor: 2,
        maxDrawdown: 0,
        sharpeRatio: 1.5,
        sortinoRatio: 1.6
      };

      MockBacktestMetrics.calculate.mockReturnValueOnce(mockMetrics);

      const mockBacktest = {
        _id: 'backtest1',
        ...backtestRequest,
        ...mockMetrics,
        trades: mockTrades,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      MockBacktest.create.mockResolvedValueOnce(mockBacktest as Backtest);

      const result = await service.runBacktest(backtestRequest);

      expect(MockBacktestMetrics.calculate).toHaveBeenCalledWith(mockTrades, backtestRequest.initialBalance);
      expect(MockBacktest.create).toHaveBeenCalledWith({
        ...backtestRequest,
        ...mockMetrics,
        trades: mockTrades
      });
      expect(result).toEqual(mockBacktest);
    });

    it('should handle run backtest error', async () => {
      const backtestRequest = {
        userId: 'user1',
        strategyId: 'strategy1',
        symbol: 'BTC/USDT',
        timeframe: '1h',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-01-31'),
        initialBalance: 1000
      };

      const error = new Error('Failed to run backtest');
      MockBacktestMetrics.calculate.mockImplementationOnce(() => {
        throw error;
      });

      await expect(service.runBacktest(backtestRequest)).rejects.toThrow('Failed to run backtest');
    });
  });
}); 