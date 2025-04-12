import { calculateBacktestMetrics } from '../backtestMetrics';
import { Trade } from '../../types/backtest';

describe('calculateBacktestMetrics', () => {
  it('should calculate metrics for winning trades', () => {
    const trades: Trade[] = [
      {
        entryTime: new Date('2023-01-01'),
        exitTime: new Date('2023-01-02'),
        entryPrice: 100,
        exitPrice: 110,
        size: 1,
        type: 'long',
        profitLoss: 10,
        profitLossPercentage: 0.1
      },
      {
        entryTime: new Date('2023-01-03'),
        exitTime: new Date('2023-01-04'),
        entryPrice: 110,
        exitPrice: 121,
        size: 1,
        type: 'long',
        profitLoss: 11,
        profitLossPercentage: 0.1
      }
    ];

    const initialBalance = 1000;

    const metrics = calculateBacktestMetrics(trades, initialBalance);

    expect(metrics).toEqual({
      finalBalance: 1021,
      totalTrades: 2,
      winningTrades: 2,
      losingTrades: 0,
      winRate: 1,
      profitFactor: Infinity,
      maxDrawdown: 0,
      sharpeRatio: expect.any(Number),
      sortinoRatio: expect.any(Number)
    });
  });

  it('should calculate metrics for losing trades', () => {
    const trades: Trade[] = [
      {
        entryTime: new Date('2023-01-01'),
        exitTime: new Date('2023-01-02'),
        entryPrice: 100,
        exitPrice: 90,
        size: 1,
        type: 'long',
        profitLoss: -10,
        profitLossPercentage: -0.1
      },
      {
        entryTime: new Date('2023-01-03'),
        exitTime: new Date('2023-01-04'),
        entryPrice: 90,
        exitPrice: 81,
        size: 1,
        type: 'long',
        profitLoss: -9,
        profitLossPercentage: -0.1
      }
    ];

    const initialBalance = 1000;

    const metrics = calculateBacktestMetrics(trades, initialBalance);

    expect(metrics).toEqual({
      finalBalance: 981,
      totalTrades: 2,
      winningTrades: 0,
      losingTrades: 2,
      winRate: 0,
      profitFactor: 0,
      maxDrawdown: 0.19,
      sharpeRatio: expect.any(Number),
      sortinoRatio: expect.any(Number)
    });
  });

  it('should calculate metrics for mixed trades', () => {
    const trades: Trade[] = [
      {
        entryTime: new Date('2023-01-01'),
        exitTime: new Date('2023-01-02'),
        entryPrice: 100,
        exitPrice: 110,
        size: 1,
        type: 'long',
        profitLoss: 10,
        profitLossPercentage: 0.1
      },
      {
        entryTime: new Date('2023-01-03'),
        exitTime: new Date('2023-01-04'),
        entryPrice: 110,
        exitPrice: 99,
        size: 1,
        type: 'long',
        profitLoss: -11,
        profitLossPercentage: -0.1
      },
      {
        entryTime: new Date('2023-01-05'),
        exitTime: new Date('2023-01-06'),
        entryPrice: 99,
        exitPrice: 108.9,
        size: 1,
        type: 'long',
        profitLoss: 9.9,
        profitLossPercentage: 0.1
      }
    ];

    const initialBalance = 1000;

    const metrics = calculateBacktestMetrics(trades, initialBalance);

    expect(metrics).toEqual({
      finalBalance: 1008.9,
      totalTrades: 3,
      winningTrades: 2,
      losingTrades: 1,
      winRate: 0.67,
      profitFactor: 1.8,
      maxDrawdown: 0.1,
      sharpeRatio: expect.any(Number),
      sortinoRatio: expect.any(Number)
    });
  });

  it('should handle empty trades array', () => {
    const trades: Trade[] = [];
    const initialBalance = 1000;

    const metrics = calculateBacktestMetrics(trades, initialBalance);

    expect(metrics).toEqual({
      finalBalance: 1000,
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      winRate: 0,
      profitFactor: 0,
      maxDrawdown: 0,
      sharpeRatio: 0,
      sortinoRatio: 0
    });
  });

  it('should handle trades with zero profit/loss', () => {
    const trades: Trade[] = [
      {
        entryTime: new Date('2023-01-01'),
        exitTime: new Date('2023-01-02'),
        entryPrice: 100,
        exitPrice: 100,
        size: 1,
        type: 'long',
        profitLoss: 0,
        profitLossPercentage: 0
      }
    ];

    const initialBalance = 1000;

    const metrics = calculateBacktestMetrics(trades, initialBalance);

    expect(metrics).toEqual({
      finalBalance: 1000,
      totalTrades: 1,
      winningTrades: 0,
      losingTrades: 0,
      winRate: 0,
      profitFactor: 0,
      maxDrawdown: 0,
      sharpeRatio: 0,
      sortinoRatio: 0
    });
  });

  it('should calculate correct max drawdown', () => {
    const trades: Trade[] = [
      {
        entryTime: new Date('2023-01-01'),
        exitTime: new Date('2023-01-02'),
        entryPrice: 100,
        exitPrice: 90,
        size: 1,
        type: 'long',
        profitLoss: -10,
        profitLossPercentage: -0.1
      },
      {
        entryTime: new Date('2023-01-03'),
        exitTime: new Date('2023-01-04'),
        entryPrice: 90,
        exitPrice: 81,
        size: 1,
        type: 'long',
        profitLoss: -9,
        profitLossPercentage: -0.1
      },
      {
        entryTime: new Date('2023-01-05'),
        exitTime: new Date('2023-01-06'),
        entryPrice: 81,
        exitPrice: 100,
        size: 1,
        type: 'long',
        profitLoss: 19,
        profitLossPercentage: 0.23
      }
    ];

    const initialBalance = 1000;

    const metrics = calculateBacktestMetrics(trades, initialBalance);

    expect(metrics.maxDrawdown).toBeCloseTo(0.19, 2);
  });

  it('should calculate correct Sharpe ratio', () => {
    const trades: Trade[] = [
      {
        entryTime: new Date('2023-01-01'),
        exitTime: new Date('2023-01-02'),
        entryPrice: 100,
        exitPrice: 110,
        size: 1,
        type: 'long',
        profitLoss: 10,
        profitLossPercentage: 0.1
      },
      {
        entryTime: new Date('2023-01-03'),
        exitTime: new Date('2023-01-04'),
        entryPrice: 110,
        exitPrice: 121,
        size: 1,
        type: 'long',
        profitLoss: 11,
        profitLossPercentage: 0.1
      }
    ];

    const initialBalance = 1000;

    const metrics = calculateBacktestMetrics(trades, initialBalance);

    // Sharpe ratio should be positive for profitable trades
    expect(metrics.sharpeRatio).toBeGreaterThan(0);
  });

  it('should calculate correct Sortino ratio', () => {
    const trades: Trade[] = [
      {
        entryTime: new Date('2023-01-01'),
        exitTime: new Date('2023-01-02'),
        entryPrice: 100,
        exitPrice: 110,
        size: 1,
        type: 'long',
        profitLoss: 10,
        profitLossPercentage: 0.1
      },
      {
        entryTime: new Date('2023-01-03'),
        exitTime: new Date('2023-01-04'),
        entryPrice: 110,
        exitPrice: 121,
        size: 1,
        type: 'long',
        profitLoss: 11,
        profitLossPercentage: 0.1
      }
    ];

    const initialBalance = 1000;

    const metrics = calculateBacktestMetrics(trades, initialBalance);

    // Sortino ratio should be positive for profitable trades
    expect(metrics.sortinoRatio).toBeGreaterThan(0);
  });
}); 