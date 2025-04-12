import axios from 'axios';
import { BacktestService } from '../backtest.service';
import { Backtest, BacktestRequest } from '../../types/backtest';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('BacktestService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createBacktest', () => {
    it('creates a backtest successfully', async () => {
      const backtestData: Partial<Backtest> = {
        strategyId: 'strategy1',
        symbol: 'BTC/USDT',
        timeframe: '1h'
      };

      const mockResponse = {
        data: {
          _id: 'backtest1',
          ...backtestData
        }
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await BacktestService.createBacktest(backtestData);

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/backtests', backtestData);
      expect(result).toEqual(mockResponse.data);
    });

    it('handles create backtest error', async () => {
      const backtestData: Partial<Backtest> = {
        strategyId: 'strategy1',
        symbol: 'BTC/USDT',
        timeframe: '1h'
      };

      mockedAxios.post.mockRejectedValueOnce(new Error('Network error'));

      await expect(BacktestService.createBacktest(backtestData)).rejects.toThrow('Network error');
    });
  });

  describe('getBacktest', () => {
    it('gets a backtest successfully', async () => {
      const mockResponse = {
        data: {
          _id: 'backtest1',
          strategyId: 'strategy1',
          symbol: 'BTC/USDT',
          timeframe: '1h'
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await BacktestService.getBacktest('backtest1');

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/backtests/backtest1');
      expect(result).toEqual(mockResponse.data);
    });

    it('handles get backtest error', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

      await expect(BacktestService.getBacktest('backtest1')).rejects.toThrow('Network error');
    });
  });

  describe('getBacktestsByUser', () => {
    it('gets backtests by user successfully', async () => {
      const mockResponse = {
        data: [
          {
            _id: 'backtest1',
            userId: 'user1',
            strategyId: 'strategy1',
            symbol: 'BTC/USDT',
            timeframe: '1h'
          }
        ]
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await BacktestService.getBacktestsByUser('user1');

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/backtests/user/user1');
      expect(result).toEqual(mockResponse.data);
    });

    it('handles get backtests by user error', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

      await expect(BacktestService.getBacktestsByUser('user1')).rejects.toThrow('Network error');
    });
  });

  describe('getBacktestsByStrategy', () => {
    it('gets backtests by strategy successfully', async () => {
      const mockResponse = {
        data: [
          {
            _id: 'backtest1',
            strategyId: 'strategy1',
            symbol: 'BTC/USDT',
            timeframe: '1h'
          }
        ]
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await BacktestService.getBacktestsByStrategy('strategy1');

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/backtests/strategy/strategy1');
      expect(result).toEqual(mockResponse.data);
    });

    it('handles get backtests by strategy error', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

      await expect(BacktestService.getBacktestsByStrategy('strategy1')).rejects.toThrow('Network error');
    });
  });

  describe('deleteBacktest', () => {
    it('deletes a backtest successfully', async () => {
      const mockResponse = {
        data: {
          success: true
        }
      };

      mockedAxios.delete.mockResolvedValueOnce(mockResponse);

      const result = await BacktestService.deleteBacktest('backtest1');

      expect(mockedAxios.delete).toHaveBeenCalledWith('/api/backtests/backtest1');
      expect(result).toEqual(mockResponse.data);
    });

    it('handles delete backtest error', async () => {
      mockedAxios.delete.mockRejectedValueOnce(new Error('Network error'));

      await expect(BacktestService.deleteBacktest('backtest1')).rejects.toThrow('Network error');
    });
  });

  describe('runBacktest', () => {
    it('runs a backtest successfully', async () => {
      const backtestRequest: BacktestRequest = {
        strategyId: 'strategy1',
        symbol: 'BTC/USDT',
        timeframe: '1h',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-01-31'),
        initialBalance: 1000
      };

      const mockResponse = {
        data: {
          _id: 'backtest1',
          ...backtestRequest
        }
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await BacktestService.runBacktest(backtestRequest);

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/backtests/run', backtestRequest);
      expect(result).toEqual(mockResponse.data);
    });

    it('handles run backtest error', async () => {
      const backtestRequest: BacktestRequest = {
        strategyId: 'strategy1',
        symbol: 'BTC/USDT',
        timeframe: '1h',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-01-31'),
        initialBalance: 1000
      };

      mockedAxios.post.mockRejectedValueOnce(new Error('Network error'));

      await expect(BacktestService.runBacktest(backtestRequest)).rejects.toThrow('Network error');
    });
  });
}); 