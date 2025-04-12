import { Trade } from '../models/trade.model';

export function calculatePerformanceMetrics(trades: Trade[], timeRange?: string): any {
  const closedTrades = trades.filter(t => t.status === 'closed');
  const openTrades = trades.filter(t => t.status === 'open');
  
  // Calculate basic metrics
  const totalTrades = trades.length;
  const winningTrades = closedTrades.filter(t => (t.pnl || 0) > 0);
  const losingTrades = closedTrades.filter(t => (t.pnl || 0) <= 0);
  
  const winRate = totalTrades > 0 ? winningTrades.length / totalTrades : 0;
  const totalPnl = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
  const averagePnl = totalTrades > 0 ? totalPnl / totalTrades : 0;
  
  // Calculate returns
  const initialBalance = trades[0]?.balance || 0;
  const currentBalance = trades[trades.length - 1]?.balance || 0;
  const totalReturn = initialBalance > 0 ? (currentBalance - initialBalance) / initialBalance : 0;
  
  // Calculate drawdown
  let maxDrawdown = 0;
  let peak = initialBalance;
  
  trades.forEach(trade => {
    if (trade.balance > peak) {
      peak = trade.balance;
    }
    const drawdown = (peak - trade.balance) / peak;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  });
  
  // Calculate volatility
  const returns = trades.map((t, i) => {
    if (i === 0) return 0;
    return (t.balance - trades[i - 1].balance) / trades[i - 1].balance;
  });
  
  const averageReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - averageReturn, 2), 0) / returns.length;
  const volatility = Math.sqrt(variance);
  
  // Calculate Sharpe ratio
  const riskFreeRate = 0.02; // 2% annual risk-free rate
  const sharpeRatio = (averageReturn - riskFreeRate/252) / volatility;
  
  // Calculate Sortino ratio
  const downsideReturns = returns.filter(r => r < 0);
  const downsideVariance = downsideReturns.reduce((sum, r) => sum + Math.pow(r, 2), 0) / downsideReturns.length;
  const downsideDeviation = Math.sqrt(downsideVariance);
  const sortinoRatio = (averageReturn - riskFreeRate/252) / downsideDeviation;
  
  // Calculate profit factor
  const grossProfit = winningTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
  const grossLoss = Math.abs(losingTrades.reduce((sum, t) => sum + (t.pnl || 0), 0));
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : 0;
  
  return {
    totalTrades,
    winningTrades: winningTrades.length,
    losingTrades: losingTrades.length,
    winRate,
    totalPnl,
    averagePnl,
    totalReturn,
    maxDrawdown,
    volatility,
    sharpeRatio,
    sortinoRatio,
    profitFactor,
    openTrades: openTrades.length,
    currentBalance,
    returns: {
      daily: calculateReturnForPeriod(trades, 'daily'),
      weekly: calculateReturnForPeriod(trades, 'weekly'),
      monthly: calculateReturnForPeriod(trades, 'monthly'),
      yearly: calculateReturnForPeriod(trades, 'yearly')
    }
  };
}

function calculateReturnForPeriod(trades: Trade[], period: 'daily' | 'weekly' | 'monthly' | 'yearly'): number {
  const now = new Date();
  let startDate = new Date();
  
  switch (period) {
    case 'daily':
      startDate.setDate(now.getDate() - 1);
      break;
    case 'weekly':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'monthly':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case 'yearly':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
  }
  
  const periodTrades = trades.filter(t => t.exitTime >= startDate);
  if (periodTrades.length === 0) return 0;
  
  const initialBalance = periodTrades[0].balance;
  const finalBalance = periodTrades[periodTrades.length - 1].balance;
  
  return initialBalance > 0 ? (finalBalance - initialBalance) / initialBalance : 0;
} 