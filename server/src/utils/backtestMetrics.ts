import { ITrade } from '../models/backtest.model';

interface BacktestMetrics {
  finalBalance: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  profitFactor: number;
  maxDrawdown: number;
  sharpeRatio: number;
  sortinoRatio: number;
}

export function calculateBacktestMetrics(trades: ITrade[], initialBalance: number): BacktestMetrics {
  if (!trades.length) {
    return {
      finalBalance: initialBalance,
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      winRate: 0,
      profitFactor: 0,
      maxDrawdown: 0,
      sharpeRatio: 0,
      sortinoRatio: 0
    };
  }

  // Calculate basic metrics
  const totalTrades = trades.length;
  const winningTrades = trades.filter(t => t.profitLoss > 0).length;
  const losingTrades = trades.filter(t => t.profitLoss < 0).length;
  const winRate = winningTrades / totalTrades;

  // Calculate profit factor
  const totalProfit = trades
    .filter(t => t.profitLoss > 0)
    .reduce((sum, t) => sum + t.profitLoss, 0);
  const totalLoss = Math.abs(trades
    .filter(t => t.profitLoss < 0)
    .reduce((sum, t) => sum + t.profitLoss, 0));
  const profitFactor = totalLoss === 0 ? Infinity : totalProfit / totalLoss;

  // Calculate max drawdown
  let maxDrawdown = 0;
  let peak = initialBalance;
  let currentBalance = initialBalance;

  trades.forEach(trade => {
    currentBalance += trade.profitLoss;
    if (currentBalance > peak) {
      peak = currentBalance;
    }
    const drawdown = (peak - currentBalance) / peak;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  });

  // Calculate Sharpe and Sortino ratios
  const returns = trades.map(t => t.profitLossPercentage);
  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  
  // Sharpe Ratio
  const riskFreeRate = 0.02; // 2% annual risk-free rate
  const dailyRiskFreeRate = Math.pow(1 + riskFreeRate, 1/365) - 1;
  const excessReturns = returns.map(r => r - dailyRiskFreeRate);
  const stdDev = Math.sqrt(
    excessReturns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
  );
  const sharpeRatio = stdDev === 0 ? 0 : (avgReturn - dailyRiskFreeRate) / stdDev;

  // Sortino Ratio
  const downsideReturns = returns.filter(r => r < 0);
  const downsideStdDev = Math.sqrt(
    downsideReturns.reduce((sum, r) => sum + Math.pow(r, 2), 0) / returns.length
  );
  const sortinoRatio = downsideStdDev === 0 ? 0 : (avgReturn - dailyRiskFreeRate) / downsideStdDev;

  return {
    finalBalance: currentBalance,
    totalTrades,
    winningTrades,
    losingTrades,
    winRate,
    profitFactor,
    maxDrawdown,
    sharpeRatio,
    sortinoRatio
  };
} 