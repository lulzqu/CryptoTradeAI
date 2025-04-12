import { Backtest, IBacktest } from '../models/backtest.model';
import { calculateBacktestMetrics } from '../utils/backtestMetrics';
import { Strategy } from '../models/strategy.model';
import { User } from '../models/user.model';

export class BacktestService {
  async createBacktest(data: Partial<IBacktest>): Promise<IBacktest> {
    const backtest = new Backtest(data);
    return await backtest.save();
  }

  async getBacktestById(id: string): Promise<IBacktest | null> {
    return await Backtest.findById(id)
      .populate('userId', 'username email')
      .populate('strategyId', 'name description');
  }

  async getBacktestsByUser(userId: string): Promise<IBacktest[]> {
    return await Backtest.find({ userId })
      .sort({ createdAt: -1 })
      .populate('strategyId', 'name description');
  }

  async getBacktestsByStrategy(strategyId: string): Promise<IBacktest[]> {
    return await Backtest.find({ strategyId })
      .sort({ createdAt: -1 })
      .populate('userId', 'username email');
  }

  async deleteBacktest(id: string): Promise<boolean> {
    const result = await Backtest.findByIdAndDelete(id);
    return !!result;
  }

  async runBacktest(
    strategyId: string,
    symbol: string,
    timeframe: string,
    startDate: Date,
    endDate: Date,
    initialBalance: number,
    userId: string
  ): Promise<IBacktest> {
    // Validate user and strategy
    const [user, strategy] = await Promise.all([
      User.findById(userId),
      Strategy.findById(strategyId)
    ]);

    if (!user) {
      throw new Error('User not found');
    }

    if (!strategy) {
      throw new Error('Strategy not found');
    }

    // Simulate trades (placeholder for actual trading logic)
    const trades = await this.simulateTrades({
      strategyId,
      symbol,
      timeframe,
      startDate,
      endDate,
      initialBalance
    });

    // Calculate metrics
    const metrics = calculateBacktestMetrics(trades, initialBalance);

    // Create backtest record
    const backtest = new Backtest({
      userId,
      strategyId,
      symbol,
      timeframe,
      startDate,
      endDate,
      initialBalance,
      trades,
      metrics
    });

    return await backtest.save();
  }

  private async simulateTrades(data: {
    strategyId: string;
    symbol: string;
    timeframe: string;
    startDate: Date;
    endDate: Date;
    initialBalance: number;
  }): Promise<IBacktest['trades']> {
    // This is a placeholder for actual trading logic
    // In a real implementation, this would use the strategy's logic
    // to generate trades based on historical data
    return [
      {
        entryTime: new Date(),
        exitTime: new Date(),
        entryPrice: 100,
        exitPrice: 105,
        quantity: 1,
        type: 'LONG',
        profitLoss: 5
      }
    ];
  }
} 