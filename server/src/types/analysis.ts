export interface Signal {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  timeframe: string;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  confidence: number;
  timestamp: Date;
  status: 'ACTIVE' | 'CLOSED' | 'CANCELLED';
  userId: string;
  favorite?: boolean;
  notified?: boolean;
  notes?: string;
}

export interface TechnicalIndicator {
  name: 'SMA' | 'EMA' | 'RSI' | 'MACD' | 'BB';
  parameters: {
    period?: number;
    fastPeriod?: number;
    slowPeriod?: number;
    signalPeriod?: number;
    stdDev?: number;
  };
}

export interface CandlestickPattern {
  name: string;
  type: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  reliability: number;
  description: string;
  timestamp: Date;
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  userId: string;
  indicators: TechnicalIndicator[];
  rules: {
    condition: string;
    action: string;
  }[];
  performance: {
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    winRate: number;
    profitFactor: number;
    maxDrawdown: number;
    sharpeRatio: number;
    averageTrade: number;
    averageWin: number;
    averageLoss: number;
  };
  backtestResults: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BacktestResult {
  id: string;
  strategyId: string;
  userId: string;
  symbol: string;
  timeframe: string;
  startDate: Date;
  endDate: Date;
  initialBalance: number;
  finalBalance: number;
  trades: {
    entryTime: Date;
    exitTime: Date;
    entryPrice: number;
    exitPrice: number;
    type: 'BUY' | 'SELL';
    quantity: number;
    profit: number;
    profitPercentage: number;
  }[];
  performance: {
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    winRate: number;
    profitFactor: number;
    maxDrawdown: number;
    sharpeRatio: number;
    averageTrade: number;
    averageWin: number;
    averageLoss: number;
  };
  createdAt: Date;
} 