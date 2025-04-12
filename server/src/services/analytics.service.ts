import { Trade } from '../models/trade.model';
import { Strategy } from '../models/strategy.model';
import { Portfolio } from '../models/portfolio.model';
import { NotFoundError } from '../utils/errors';
import { calculatePerformanceMetrics } from '../utils/performanceMetrics';

export class AnalyticsService {
  async getTradeAnalytics(userId: string, timeRange: string): Promise<any> {
    const trades = await Trade.find({ user: userId })
      .sort({ entryTime: -1 })
      .exec();

    return calculatePerformanceMetrics(trades, timeRange);
  }

  async getStrategyAnalytics(strategyId: string): Promise<any> {
    const strategy = await Strategy.findById(strategyId);
    
    if (!strategy) {
      throw new NotFoundError('Strategy not found');
    }

    const trades = await Trade.find({ strategy: strategyId })
      .sort({ entryTime: -1 })
      .exec();

    return {
      ...strategy.performance,
      trades: trades.length,
      recentTrades: trades.slice(0, 10),
      metrics: calculatePerformanceMetrics(trades)
    };
  }

  async getPortfolioAnalytics(portfolioId: string): Promise<any> {
    const portfolio = await Portfolio.findById(portfolioId)
      .populate('strategies.strategy', 'performance')
      .exec();
    
    if (!portfolio) {
      throw new NotFoundError('Portfolio not found');
    }

    const strategyIds = portfolio.strategies.map(s => s.strategy);
    const trades = await Trade.find({ strategy: { $in: strategyIds } })
      .sort({ entryTime: -1 })
      .exec();

    return {
      ...portfolio.performance,
      trades: trades.length,
      recentTrades: trades.slice(0, 10),
      metrics: calculatePerformanceMetrics(trades)
    };
  }

  async getMarketAnalytics(symbol: string, timeframe: string): Promise<any> {
    // TODO: Implement market analytics
    // This should include:
    // 1. Price data
    // 2. Volume data
    // 3. Technical indicators
    // 4. Market sentiment
    // 5. Order book data

    return {
      symbol,
      timeframe,
      price: {
        current: 0,
        high: 0,
        low: 0,
        change: 0,
        changePercent: 0
      },
      volume: {
        current: 0,
        average: 0,
        change: 0
      },
      indicators: {
        rsi: 0,
        macd: {
          value: 0,
          signal: 0,
          histogram: 0
        },
        bollingerBands: {
          upper: 0,
          middle: 0,
          lower: 0
        }
      },
      sentiment: {
        score: 0,
        trend: 'neutral'
      },
      orderBook: {
        bids: [],
        asks: []
      }
    };
  }

  async getRiskAnalytics(userId: string): Promise<any> {
    const trades = await Trade.find({ user: userId })
      .sort({ entryTime: -1 })
      .exec();

    const portfolios = await Portfolio.find({ user: userId })
      .populate('strategies.strategy', 'performance')
      .exec();

    return {
      trades: {
        total: trades.length,
        open: trades.filter(t => t.status === 'open').length,
        closed: trades.filter(t => t.status === 'closed').length,
        winRate: trades.filter(t => t.pnl > 0).length / trades.length,
        averagePnl: trades.reduce((sum, t) => sum + (t.pnl || 0), 0) / trades.length,
        maxDrawdown: Math.min(...trades.map(t => t.pnl || 0))
      },
      portfolios: portfolios.map(p => ({
        id: p._id,
        name: p.name,
        riskMetrics: {
          volatility: p.performance.volatility,
          sharpeRatio: p.performance.sharpeRatio,
          maxDrawdown: p.performance.maxDrawdown
        }
      }))
    };
  }

  async getUserAnalytics(userId: string): Promise<any> {
    const trades = await Trade.find({ user: userId })
      .sort({ entryTime: -1 })
      .exec();

    const strategies = await Strategy.find({ user: userId })
      .sort({ createdAt: -1 })
      .exec();

    const portfolios = await Portfolio.find({ user: userId })
      .populate('strategies.strategy', 'performance')
      .exec();

    return {
      trades: {
        total: trades.length,
        open: trades.filter(t => t.status === 'open').length,
        closed: trades.filter(t => t.status === 'closed').length,
        winRate: trades.filter(t => t.pnl > 0).length / trades.length,
        averagePnl: trades.reduce((sum, t) => sum + (t.pnl || 0), 0) / trades.length,
        maxDrawdown: Math.min(...trades.map(t => t.pnl || 0))
      },
      strategies: {
        total: strategies.length,
        active: strategies.filter(s => s.status === 'active').length,
        inactive: strategies.filter(s => s.status === 'inactive').length,
        testing: strategies.filter(s => s.status === 'testing').length
      },
      portfolios: {
        total: portfolios.length,
        active: portfolios.filter(p => p.status === 'active').length,
        inactive: portfolios.filter(p => p.status === 'inactive').length,
        closed: portfolios.filter(p => p.status === 'closed').length
      }
    };
  }
} 