import { Strategy, IStrategy } from '../models/strategy.model';
import { User } from '../models/user.model';
import { NotFoundError, ValidationError } from '../utils/errors';
import { calculateBacktestMetrics } from '../utils/backtestMetrics';

export class StrategyService {
  async createStrategy(data: Partial<IStrategy>): Promise<IStrategy> {
    // Validate user exists
    const user = await User.findById(data.user);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Create strategy
    const strategy = new Strategy(data);
    return strategy.save();
  }

  async getStrategyById(id: string): Promise<IStrategy> {
    const strategy = await Strategy.findById(id)
      .populate('user', 'username email')
      .exec();
    
    if (!strategy) {
      throw new NotFoundError('Strategy not found');
    }

    return strategy;
  }

  async getStrategiesByUser(userId: string): Promise<IStrategy[]> {
    return Strategy.find({ user: userId })
      .populate('user', 'username email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateStrategy(id: string, data: Partial<IStrategy>): Promise<IStrategy> {
    const strategy = await Strategy.findById(id);
    
    if (!strategy) {
      throw new NotFoundError('Strategy not found');
    }

    // Update fields
    Object.assign(strategy, data);
    return strategy.save();
  }

  async deleteStrategy(id: string): Promise<boolean> {
    const result = await Strategy.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async runStrategy(id: string): Promise<IStrategy> {
    const strategy = await Strategy.findById(id);
    
    if (!strategy) {
      throw new NotFoundError('Strategy not found');
    }

    if (strategy.status !== 'active') {
      throw new ValidationError('Strategy is not active');
    }

    // TODO: Implement actual strategy execution logic
    // This is a placeholder for the actual implementation
    strategy.lastRun = new Date();
    strategy.nextRun = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    
    return strategy.save();
  }

  async testStrategy(data: Partial<IStrategy>): Promise<any> {
    // TODO: Implement strategy testing logic
    // This should include:
    // 1. Validate strategy parameters
    // 2. Run backtest
    // 3. Calculate performance metrics
    // 4. Return test results

    const testResults = {
      trades: [], // Placeholder for actual trades
      metrics: calculateBacktestMetrics([], 1000), // Placeholder for actual metrics
      executionTime: 0,
      errors: []
    };

    return testResults;
  }

  async optimizeStrategy(id: string, parameters: Record<string, any>): Promise<IStrategy> {
    const strategy = await Strategy.findById(id);
    
    if (!strategy) {
      throw new NotFoundError('Strategy not found');
    }

    // TODO: Implement strategy optimization logic
    // This should include:
    // 1. Parameter optimization
    // 2. Performance testing
    // 3. Update strategy with optimized parameters

    strategy.parameters = parameters;
    return strategy.save();
  }

  async getPublicStrategies(): Promise<IStrategy[]> {
    return Strategy.find({ isPublic: true })
      .populate('user', 'username email')
      .sort({ 'performance.sharpeRatio': -1 })
      .exec();
  }

  async duplicateStrategy(id: string, userId: string): Promise<IStrategy> {
    const strategy = await Strategy.findById(id);
    
    if (!strategy) {
      throw new NotFoundError('Strategy not found');
    }

    // Create new strategy with same parameters but reset performance
    const newStrategy = new Strategy({
      ...strategy.toObject(),
      _id: undefined,
      user: userId,
      name: `${strategy.name} (Copy)`,
      status: 'inactive',
      performance: {
        totalTrades: 0,
        winRate: 0,
        profitFactor: 0,
        sharpeRatio: 0,
        maxDrawdown: 0
      },
      lastRun: null,
      nextRun: null
    });

    return newStrategy.save();
  }
} 