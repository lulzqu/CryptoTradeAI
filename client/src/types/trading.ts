export interface Position {
  _id: string;
  userId: string;
  symbol: string;
  type: 'long' | 'short';
  entryPrice: number;
  currentPrice: number;
  quantity: number;
  leverage: number;
  stopLoss: number;
  takeProfit: number;
  status: 'open' | 'closed';
  pnl: number;
  pnlPercentage: number;
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
}

export interface Signal {
  _id: string;
  userId: string;
  symbol: string;
  type: 'buy' | 'sell';
  price: number;
  timestamp: Date;
  source: string;
  confidence: number;
  metadata?: any;
}

export interface MarketData {
  symbol: string;
  price: number;
  volume: number;
  timestamp: Date;
  change24h: number;
  changePercentage24h: number;
  high24h: number;
  low24h: number;
}

export interface Order {
  _id: string;
  userId: string;
  symbol: string;
  type: 'market' | 'limit' | 'stop';
  side: 'buy' | 'sell';
  price: number;
  quantity: number;
  status: 'pending' | 'filled' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  filledAt?: Date;
  cancelledAt?: Date;
}

export interface Trade {
  _id: string;
  userId: string;
  symbol: string;
  type: 'long' | 'short';
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  leverage: number;
  pnl: number;
  pnlPercentage: number;
  entryTime: Date;
  exitTime: Date;
  duration: number;
  metadata?: any;
} 