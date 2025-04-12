import { Portfolio, IPortfolio } from '../models/portfolio.model';
import { User } from '../models/user.model';
import { Strategy } from '../models/strategy.model';
import { NotFoundError, ValidationError } from '../utils/errors';
import { calculatePortfolioMetrics } from '../utils/portfolioMetrics';

export class PortfolioService {
  async createPortfolio(data: Partial<IPortfolio>): Promise<IPortfolio> {
    // Validate user exists
    const user = await User.findById(data.user);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Validate strategies exist
    if (data.strategies) {
      for (const strategy of data.strategies) {
        const exists = await Strategy.findById(strategy.strategy);
        if (!exists) {
          throw new NotFoundError(`Strategy ${strategy.strategy} not found`);
        }
      }
    }

    // Create portfolio
    const portfolio = new Portfolio(data);
    return portfolio.save();
  }

  async getPortfolioById(id: string): Promise<IPortfolio> {
    const portfolio = await Portfolio.findById(id)
      .populate('user', 'username email')
      .populate('strategies.strategy', 'name type status')
      .exec();
    
    if (!portfolio) {
      throw new NotFoundError('Portfolio not found');
    }

    return portfolio;
  }

  async getPortfoliosByUser(userId: string): Promise<IPortfolio[]> {
    return Portfolio.find({ user: userId })
      .populate('user', 'username email')
      .populate('strategies.strategy', 'name type status')
      .sort({ createdAt: -1 })
      .exec();
  }

  async updatePortfolio(id: string, data: Partial<IPortfolio>): Promise<IPortfolio> {
    const portfolio = await Portfolio.findById(id);
    
    if (!portfolio) {
      throw new NotFoundError('Portfolio not found');
    }

    // Validate strategies if provided
    if (data.strategies) {
      for (const strategy of data.strategies) {
        const exists = await Strategy.findById(strategy.strategy);
        if (!exists) {
          throw new NotFoundError(`Strategy ${strategy.strategy} not found`);
        }
      }
    }

    // Update fields
    Object.assign(portfolio, data);
    return portfolio.save();
  }

  async deletePortfolio(id: string): Promise<boolean> {
    const result = await Portfolio.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async addStrategy(portfolioId: string, strategyId: string, weight: number): Promise<IPortfolio> {
    const portfolio = await Portfolio.findById(portfolioId);
    const strategy = await Strategy.findById(strategyId);
    
    if (!portfolio) {
      throw new NotFoundError('Portfolio not found');
    }
    
    if (!strategy) {
      throw new NotFoundError('Strategy not found');
    }

    // Check if strategy already exists in portfolio
    const existingStrategy = portfolio.strategies.find(s => s.strategy.toString() === strategyId);
    if (existingStrategy) {
      throw new ValidationError('Strategy already exists in portfolio');
    }

    // Add strategy
    portfolio.strategies.push({
      strategy: strategy._id,
      weight,
      status: 'active'
    });

    return portfolio.save();
  }

  async removeStrategy(portfolioId: string, strategyId: string): Promise<IPortfolio> {
    const portfolio = await Portfolio.findById(portfolioId);
    
    if (!portfolio) {
      throw new NotFoundError('Portfolio not found');
    }

    // Remove strategy
    portfolio.strategies = portfolio.strategies.filter(s => s.strategy.toString() !== strategyId);
    return portfolio.save();
  }

  async updateStrategyWeight(portfolioId: string, strategyId: string, weight: number): Promise<IPortfolio> {
    const portfolio = await Portfolio.findById(portfolioId);
    
    if (!portfolio) {
      throw new NotFoundError('Portfolio not found');
    }

    // Update strategy weight
    const strategy = portfolio.strategies.find(s => s.strategy.toString() === strategyId);
    if (!strategy) {
      throw new NotFoundError('Strategy not found in portfolio');
    }

    strategy.weight = weight;
    return portfolio.save();
  }

  async updateStrategyStatus(portfolioId: string, strategyId: string, status: 'active' | 'inactive'): Promise<IPortfolio> {
    const portfolio = await Portfolio.findById(portfolioId);
    
    if (!portfolio) {
      throw new NotFoundError('Portfolio not found');
    }

    // Update strategy status
    const strategy = portfolio.strategies.find(s => s.strategy.toString() === strategyId);
    if (!strategy) {
      throw new NotFoundError('Strategy not found in portfolio');
    }

    strategy.status = status;
    return portfolio.save();
  }

  async calculatePortfolioMetrics(portfolioId: string): Promise<any> {
    const portfolio = await Portfolio.findById(portfolioId)
      .populate('strategies.strategy', 'performance')
      .exec();
    
    if (!portfolio) {
      throw new NotFoundError('Portfolio not found');
    }

    // Calculate portfolio metrics
    return calculatePortfolioMetrics(portfolio);
  }

  async rebalancePortfolio(portfolioId: string): Promise<IPortfolio> {
    const portfolio = await Portfolio.findById(portfolioId);
    
    if (!portfolio) {
      throw new NotFoundError('Portfolio not found');
    }

    // TODO: Implement portfolio rebalancing logic
    // This should:
    // 1. Calculate current allocations
    // 2. Compare with target allocations
    // 3. Generate rebalancing orders
    // 4. Update portfolio positions

    return portfolio.save();
  }
} 