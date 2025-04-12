import { Trade } from '../models/trade.model';
import { Portfolio } from '../models/portfolio.model';
import { Strategy } from '../models/strategy.model';
import { NotFoundError } from '../utils/errors';
import { NotificationService } from './notification.service';

export class RiskService {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  async checkTradeRisk(trade: Trade): Promise<boolean> {
    const portfolio = await Portfolio.findById(trade.portfolio);
    if (!portfolio) {
      throw new NotFoundError('Portfolio not found');
    }

    const riskSettings = portfolio.riskSettings;
    const positionSize = trade.quantity * trade.entryPrice;
    const portfolioValue = portfolio.balance.total;

    // Check position size limit
    if (positionSize > portfolioValue * riskSettings.maxPositionSize) {
      await this.notificationService.createRiskNotification(
        trade.user.toString(),
        `Position size ${positionSize} exceeds maximum allowed ${portfolioValue * riskSettings.maxPositionSize}`
      );
      return false;
    }

    // Check stop loss
    if (trade.stopLoss && trade.entryPrice - trade.stopLoss > trade.entryPrice * riskSettings.maxStopLoss) {
      await this.notificationService.createRiskNotification(
        trade.user.toString(),
        `Stop loss ${trade.entryPrice - trade.stopLoss} exceeds maximum allowed ${trade.entryPrice * riskSettings.maxStopLoss}`
      );
      return false;
    }

    // Check leverage
    if (trade.leverage > riskSettings.maxLeverage) {
      await this.notificationService.createRiskNotification(
        trade.user.toString(),
        `Leverage ${trade.leverage} exceeds maximum allowed ${riskSettings.maxLeverage}`
      );
      return false;
    }

    return true;
  }

  async checkPortfolioRisk(portfolioId: string): Promise<boolean> {
    const portfolio = await Portfolio.findById(portfolioId)
      .populate('strategies.strategy', 'performance')
      .exec();
    
    if (!portfolio) {
      throw new NotFoundError('Portfolio not found');
    }

    const riskSettings = portfolio.riskSettings;
    const trades = await Trade.find({ portfolio: portfolioId, status: 'open' });
    const totalExposure = trades.reduce((sum, t) => sum + (t.quantity * t.currentPrice), 0);
    const portfolioValue = portfolio.balance.total;

    // Check total exposure
    if (totalExposure > portfolioValue * riskSettings.maxExposure) {
      await this.notificationService.createRiskNotification(
        portfolio.user.toString(),
        `Total exposure ${totalExposure} exceeds maximum allowed ${portfolioValue * riskSettings.maxExposure}`
      );
      return false;
    }

    // Check drawdown
    const drawdown = (portfolioValue - portfolio.performance.maxDrawdown) / portfolioValue;
    if (drawdown > riskSettings.maxDrawdown) {
      await this.notificationService.createRiskNotification(
        portfolio.user.toString(),
        `Drawdown ${drawdown} exceeds maximum allowed ${riskSettings.maxDrawdown}`
      );
      return false;
    }

    // Check correlation
    const correlations = this.calculateCorrelations(trades);
    if (correlations.some(c => c > riskSettings.maxCorrelation)) {
      await this.notificationService.createRiskNotification(
        portfolio.user.toString(),
        `Correlation exceeds maximum allowed ${riskSettings.maxCorrelation}`
      );
      return false;
    }

    return true;
  }

  async checkStrategyRisk(strategyId: string): Promise<boolean> {
    const strategy = await Strategy.findById(strategyId);
    
    if (!strategy) {
      throw new NotFoundError('Strategy not found');
    }

    const trades = await Trade.find({ strategy: strategyId });
    const winRate = trades.filter(t => t.pnl > 0).length / trades.length;
    const averagePnl = trades.reduce((sum, t) => sum + (t.pnl || 0), 0) / trades.length;
    const maxDrawdown = Math.min(...trades.map(t => t.pnl || 0));

    // Check win rate
    if (winRate < strategy.riskSettings.minWinRate) {
      await this.notificationService.createRiskNotification(
        strategy.user.toString(),
        `Win rate ${winRate} below minimum required ${strategy.riskSettings.minWinRate}`
      );
      return false;
    }

    // Check average PnL
    if (averagePnl < strategy.riskSettings.minAveragePnl) {
      await this.notificationService.createRiskNotification(
        strategy.user.toString(),
        `Average PnL ${averagePnl} below minimum required ${strategy.riskSettings.minAveragePnl}`
      );
      return false;
    }

    // Check max drawdown
    if (maxDrawdown < strategy.riskSettings.maxDrawdown) {
      await this.notificationService.createRiskNotification(
        strategy.user.toString(),
        `Max drawdown ${maxDrawdown} exceeds maximum allowed ${strategy.riskSettings.maxDrawdown}`
      );
      return false;
    }

    return true;
  }

  private calculateCorrelations(trades: Trade[]): number[] {
    // TODO: Implement correlation calculation
    // This should calculate the correlation between different trading pairs
    // and return an array of correlation coefficients
    return [];
  }

  async getRiskMetrics(userId: string): Promise<any> {
    const portfolios = await Portfolio.find({ user: userId })
      .populate('strategies.strategy', 'performance')
      .exec();

    const trades = await Trade.find({ user: userId })
      .sort({ entryTime: -1 })
      .exec();

    return {
      portfolios: portfolios.map(p => ({
        id: p._id,
        name: p.name,
        riskMetrics: {
          exposure: p.balance.inPositions / p.balance.total,
          drawdown: p.performance.maxDrawdown,
          volatility: p.performance.volatility,
          sharpeRatio: p.performance.sharpeRatio
        }
      })),
      trades: {
        total: trades.length,
        open: trades.filter(t => t.status === 'open').length,
        winRate: trades.filter(t => t.pnl > 0).length / trades.length,
        averagePnl: trades.reduce((sum, t) => sum + (t.pnl || 0), 0) / trades.length,
        maxDrawdown: Math.min(...trades.map(t => t.pnl || 0))
      }
    };
  }
} 