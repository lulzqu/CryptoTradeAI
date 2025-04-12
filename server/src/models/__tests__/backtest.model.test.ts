import mongoose from 'mongoose';
import { Backtest } from '../backtest.model';

describe('Backtest Model', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Backtest.deleteMany({});
  });

  describe('Schema Validation', () => {
    it('should create a valid backtest', async () => {
      const backtestData = {
        userId: new mongoose.Types.ObjectId(),
        strategyId: new mongoose.Types.ObjectId(),
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
        trades: []
      };

      const backtest = new Backtest(backtestData);
      const savedBacktest = await backtest.save();

      expect(savedBacktest._id).toBeDefined();
      expect(savedBacktest.userId).toEqual(backtestData.userId);
      expect(savedBacktest.strategyId).toEqual(backtestData.strategyId);
      expect(savedBacktest.symbol).toBe(backtestData.symbol);
      expect(savedBacktest.timeframe).toBe(backtestData.timeframe);
      expect(savedBacktest.startDate).toEqual(backtestData.startDate);
      expect(savedBacktest.endDate).toEqual(backtestData.endDate);
      expect(savedBacktest.initialBalance).toBe(backtestData.initialBalance);
      expect(savedBacktest.finalBalance).toBe(backtestData.finalBalance);
      expect(savedBacktest.totalTrades).toBe(backtestData.totalTrades);
      expect(savedBacktest.winningTrades).toBe(backtestData.winningTrades);
      expect(savedBacktest.losingTrades).toBe(backtestData.losingTrades);
      expect(savedBacktest.winRate).toBe(backtestData.winRate);
      expect(savedBacktest.profitFactor).toBe(backtestData.profitFactor);
      expect(savedBacktest.maxDrawdown).toBe(backtestData.maxDrawdown);
      expect(savedBacktest.sharpeRatio).toBe(backtestData.sharpeRatio);
      expect(savedBacktest.sortinoRatio).toBe(backtestData.sortinoRatio);
      expect(savedBacktest.trades).toEqual(backtestData.trades);
    });

    it('should require userId', async () => {
      const backtestData = {
        strategyId: new mongoose.Types.ObjectId(),
        symbol: 'BTC/USDT',
        timeframe: '1h'
      };

      const backtest = new Backtest(backtestData);
      await expect(backtest.save()).rejects.toThrow('userId');
    });

    it('should require strategyId', async () => {
      const backtestData = {
        userId: new mongoose.Types.ObjectId(),
        symbol: 'BTC/USDT',
        timeframe: '1h'
      };

      const backtest = new Backtest(backtestData);
      await expect(backtest.save()).rejects.toThrow('strategyId');
    });

    it('should require symbol', async () => {
      const backtestData = {
        userId: new mongoose.Types.ObjectId(),
        strategyId: new mongoose.Types.ObjectId(),
        timeframe: '1h'
      };

      const backtest = new Backtest(backtestData);
      await expect(backtest.save()).rejects.toThrow('symbol');
    });

    it('should require timeframe', async () => {
      const backtestData = {
        userId: new mongoose.Types.ObjectId(),
        strategyId: new mongoose.Types.ObjectId(),
        symbol: 'BTC/USDT'
      };

      const backtest = new Backtest(backtestData);
      await expect(backtest.save()).rejects.toThrow('timeframe');
    });

    it('should validate symbol format', async () => {
      const backtestData = {
        userId: new mongoose.Types.ObjectId(),
        strategyId: new mongoose.Types.ObjectId(),
        symbol: 'INVALID',
        timeframe: '1h'
      };

      const backtest = new Backtest(backtestData);
      await expect(backtest.save()).rejects.toThrow('symbol');
    });

    it('should validate timeframe format', async () => {
      const backtestData = {
        userId: new mongoose.Types.ObjectId(),
        strategyId: new mongoose.Types.ObjectId(),
        symbol: 'BTC/USDT',
        timeframe: 'invalid'
      };

      const backtest = new Backtest(backtestData);
      await expect(backtest.save()).rejects.toThrow('timeframe');
    });

    it('should validate date range', async () => {
      const backtestData = {
        userId: new mongoose.Types.ObjectId(),
        strategyId: new mongoose.Types.ObjectId(),
        symbol: 'BTC/USDT',
        timeframe: '1h',
        startDate: new Date('2023-01-31'),
        endDate: new Date('2023-01-01')
      };

      const backtest = new Backtest(backtestData);
      await expect(backtest.save()).rejects.toThrow('endDate');
    });

    it('should validate numeric fields', async () => {
      const backtestData = {
        userId: new mongoose.Types.ObjectId(),
        strategyId: new mongoose.Types.ObjectId(),
        symbol: 'BTC/USDT',
        timeframe: '1h',
        initialBalance: -1000,
        finalBalance: -1200,
        totalTrades: -10,
        winningTrades: -6,
        losingTrades: -4,
        winRate: -0.6,
        profitFactor: -1.5,
        maxDrawdown: -0.1,
        sharpeRatio: -1.2,
        sortinoRatio: -1.3
      };

      const backtest = new Backtest(backtestData);
      await expect(backtest.save()).rejects.toThrow();
    });
  });

  describe('Trade Schema Validation', () => {
    it('should create a valid trade', async () => {
      const backtestData = {
        userId: new mongoose.Types.ObjectId(),
        strategyId: new mongoose.Types.ObjectId(),
        symbol: 'BTC/USDT',
        timeframe: '1h',
        trades: [
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
        ]
      };

      const backtest = new Backtest(backtestData);
      const savedBacktest = await backtest.save();

      expect(savedBacktest.trades[0]._id).toBeDefined();
      expect(savedBacktest.trades[0].entryTime).toEqual(backtestData.trades[0].entryTime);
      expect(savedBacktest.trades[0].exitTime).toEqual(backtestData.trades[0].exitTime);
      expect(savedBacktest.trades[0].entryPrice).toBe(backtestData.trades[0].entryPrice);
      expect(savedBacktest.trades[0].exitPrice).toBe(backtestData.trades[0].exitPrice);
      expect(savedBacktest.trades[0].size).toBe(backtestData.trades[0].size);
      expect(savedBacktest.trades[0].type).toBe(backtestData.trades[0].type);
      expect(savedBacktest.trades[0].profitLoss).toBe(backtestData.trades[0].profitLoss);
      expect(savedBacktest.trades[0].profitLossPercentage).toBe(backtestData.trades[0].profitLossPercentage);
    });

    it('should require trade fields', async () => {
      const backtestData = {
        userId: new mongoose.Types.ObjectId(),
        strategyId: new mongoose.Types.ObjectId(),
        symbol: 'BTC/USDT',
        timeframe: '1h',
        trades: [
          {
            entryTime: new Date('2023-01-01')
          }
        ]
      };

      const backtest = new Backtest(backtestData);
      await expect(backtest.save()).rejects.toThrow();
    });

    it('should validate trade type', async () => {
      const backtestData = {
        userId: new mongoose.Types.ObjectId(),
        strategyId: new mongoose.Types.ObjectId(),
        symbol: 'BTC/USDT',
        timeframe: '1h',
        trades: [
          {
            entryTime: new Date('2023-01-01'),
            exitTime: new Date('2023-01-02'),
            entryPrice: 100,
            exitPrice: 110,
            size: 1,
            type: 'invalid',
            profitLoss: 10,
            profitLossPercentage: 0.1
          }
        ]
      };

      const backtest = new Backtest(backtestData);
      await expect(backtest.save()).rejects.toThrow('type');
    });

    it('should validate trade dates', async () => {
      const backtestData = {
        userId: new mongoose.Types.ObjectId(),
        strategyId: new mongoose.Types.ObjectId(),
        symbol: 'BTC/USDT',
        timeframe: '1h',
        trades: [
          {
            entryTime: new Date('2023-01-02'),
            exitTime: new Date('2023-01-01'),
            entryPrice: 100,
            exitPrice: 110,
            size: 1,
            type: 'long',
            profitLoss: 10,
            profitLossPercentage: 0.1
          }
        ]
      };

      const backtest = new Backtest(backtestData);
      await expect(backtest.save()).rejects.toThrow('exitTime');
    });
  });
}); 