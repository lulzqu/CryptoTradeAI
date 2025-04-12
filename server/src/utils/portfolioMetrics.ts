import { IPortfolio } from '../models/portfolio.model';

export function calculatePortfolioMetrics(portfolio: IPortfolio): any {
  const metrics = {
    totalValue: 0,
    totalReturn: 0,
    dailyReturn: 0,
    weeklyReturn: 0,
    monthlyReturn: 0,
    yearlyReturn: 0,
    sharpeRatio: 0,
    sortinoRatio: 0,
    maxDrawdown: 0,
    winRate: 0,
    profitFactor: 0,
    allocation: {} as Record<string, number>,
    riskMetrics: {
      volatility: 0,
      beta: 0,
      alpha: 0,
      correlation: {} as Record<string, number>
    }
  };

  // Calculate total value
  metrics.totalValue = portfolio.balance.total;

  // Calculate returns
  if (portfolio.performance) {
    metrics.totalReturn = portfolio.performance.totalReturn;
    metrics.dailyReturn = portfolio.performance.dailyReturn;
    metrics.weeklyReturn = portfolio.performance.weeklyReturn;
    metrics.monthlyReturn = portfolio.performance.monthlyReturn;
    metrics.yearlyReturn = portfolio.performance.yearlyReturn;
    metrics.sharpeRatio = portfolio.performance.sharpeRatio;
    metrics.sortinoRatio = portfolio.performance.sortinoRatio;
    metrics.maxDrawdown = portfolio.performance.maxDrawdown;
    metrics.winRate = portfolio.performance.winRate;
    metrics.profitFactor = portfolio.performance.profitFactor;
  }

  // Calculate allocation
  if (portfolio.strategies) {
    portfolio.strategies.forEach(strategy => {
      const strategyId = strategy.strategy.toString();
      metrics.allocation[strategyId] = strategy.weight;
    });
  }

  // Calculate risk metrics
  if (portfolio.positions) {
    // Calculate volatility
    const returns = portfolio.positions.map(p => p.unrealizedPnlPercentage);
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
    metrics.riskMetrics.volatility = Math.sqrt(variance);

    // Calculate beta (placeholder)
    metrics.riskMetrics.beta = 1.0;

    // Calculate alpha (placeholder)
    metrics.riskMetrics.alpha = 0.0;

    // Calculate correlations (placeholder)
    portfolio.positions.forEach(position => {
      metrics.riskMetrics.correlation[position.symbol] = 0.5;
    });
  }

  return metrics;
} 