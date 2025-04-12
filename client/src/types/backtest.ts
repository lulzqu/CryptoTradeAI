export interface Backtest {
  _id: string;
  userId: string;
  strategyId: string;
  symbol: string;
  timeframe: string;
  startDate: Date;
  endDate: Date;
  initialBalance: number;
  finalBalance: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  profitFactor: number;
  maxDrawdown: number;
  sharpeRatio: number;
  sortinoRatio: number;
  trades: Trade[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Trade {
  entryTime: Date;
  exitTime: Date;
  entryPrice: number;
  exitPrice: number;
  size: number;
  type: 'long' | 'short';
  profitLoss: number;
  profitLossPercentage: number;
}

export interface BacktestRequest {
  strategyId: string;
  symbol: string;
  timeframe: string;
  startDate: Date;
  endDate: Date;
  initialBalance: number;
} 