import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.model';
import { IStrategy } from './strategy.model';

export interface IPortfolio extends Document {
  user: IUser['_id'];
  name: string;
  description?: string;
  type: 'spot' | 'futures' | 'margin';
  status: 'active' | 'inactive' | 'closed';
  strategies: Array<{
    strategy: IStrategy['_id'];
    weight: number;
    status: 'active' | 'inactive';
  }>;
  balance: {
    total: number;
    available: number;
    inPositions: number;
    inOrders: number;
    currencies: Array<{
      currency: string;
      total: number;
      available: number;
      inPositions: number;
      inOrders: number;
    }>;
  };
  performance: {
    totalReturn: number;
    dailyReturn: number;
    weeklyReturn: number;
    monthlyReturn: number;
    yearlyReturn: number;
    sharpeRatio: number;
    sortinoRatio: number;
    maxDrawdown: number;
    winRate: number;
    profitFactor: number;
  };
  riskSettings: {
    maxDrawdown: number;
    maxPositionSize: number;
    maxLeverage: number;
    stopLoss: number;
    takeProfit: number;
    trailingStop: boolean;
  };
  positions: Array<{
    symbol: string;
    side: 'long' | 'short';
    quantity: number;
    entryPrice: number;
    currentPrice: number;
    unrealizedPnl: number;
    unrealizedPnlPercentage: number;
    leverage: number;
    margin: number;
    liquidationPrice: number;
    stopLoss?: number;
    takeProfit?: number;
    trailingStop?: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
  metadata: Record<string, any>;
}

const PortfolioSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['spot', 'futures', 'margin'], required: true },
  status: { type: String, enum: ['active', 'inactive', 'closed'], default: 'active' },
  strategies: [{
    strategy: { type: Schema.Types.ObjectId, ref: 'Strategy', required: true },
    weight: { type: Number, required: true, min: 0, max: 1 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
  }],
  balance: {
    total: { type: Number, default: 0 },
    available: { type: Number, default: 0 },
    inPositions: { type: Number, default: 0 },
    inOrders: { type: Number, default: 0 },
    currencies: [{
      currency: { type: String, required: true },
      total: { type: Number, default: 0 },
      available: { type: Number, default: 0 },
      inPositions: { type: Number, default: 0 },
      inOrders: { type: Number, default: 0 }
    }]
  },
  performance: {
    totalReturn: { type: Number, default: 0 },
    dailyReturn: { type: Number, default: 0 },
    weeklyReturn: { type: Number, default: 0 },
    monthlyReturn: { type: Number, default: 0 },
    yearlyReturn: { type: Number, default: 0 },
    sharpeRatio: { type: Number, default: 0 },
    sortinoRatio: { type: Number, default: 0 },
    maxDrawdown: { type: Number, default: 0 },
    winRate: { type: Number, default: 0 },
    profitFactor: { type: Number, default: 0 }
  },
  riskSettings: {
    maxDrawdown: { type: Number, required: true },
    maxPositionSize: { type: Number, required: true },
    maxLeverage: { type: Number, required: true },
    stopLoss: { type: Number },
    takeProfit: { type: Number },
    trailingStop: { type: Boolean, default: false }
  },
  positions: [{
    symbol: { type: String, required: true },
    side: { type: String, enum: ['long', 'short'], required: true },
    quantity: { type: Number, required: true },
    entryPrice: { type: Number, required: true },
    currentPrice: { type: Number, required: true },
    unrealizedPnl: { type: Number, default: 0 },
    unrealizedPnlPercentage: { type: Number, default: 0 },
    leverage: { type: Number, default: 1 },
    margin: { type: Number, required: true },
    liquidationPrice: { type: Number, required: true },
    stopLoss: { type: Number },
    takeProfit: { type: Number },
    trailingStop: { type: Number }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  metadata: { type: Map, of: Schema.Types.Mixed }
});

// Indexes
PortfolioSchema.index({ user: 1, name: 1 }, { unique: true });
PortfolioSchema.index({ status: 1, updatedAt: 1 });

// Update timestamps and calculate performance metrics
PortfolioSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Calculate total balance
  this.balance.total = this.balance.currencies.reduce((total, currency) => {
    return total + (currency.total * currency.currentPrice || 0);
  }, 0);
  
  // Calculate performance metrics
  // TODO: Implement performance calculations
  
  next();
});

export const Portfolio = mongoose.model<IPortfolio>('Portfolio', PortfolioSchema); 