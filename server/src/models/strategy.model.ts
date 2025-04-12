import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.model';

export interface IStrategy extends Document {
  name: string;
  description: string;
  type: 'manual' | 'automated';
  status: 'active' | 'inactive' | 'testing';
  parameters: Record<string, any>;
  code: string;
  user: IUser['_id'];
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  performance: {
    totalTrades: number;
    winRate: number;
    profitFactor: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
  tags: string[];
  version: string;
  lastRun: Date;
  nextRun: Date;
  schedule?: {
    type: 'interval' | 'cron';
    value: string;
  };
  exchange: string;
  symbols: string[];
  timeframe: string;
  riskSettings: {
    maxPositionSize: number;
    maxLeverage: number;
    stopLoss: number;
    takeProfit: number;
    trailingStop: boolean;
  };
}

const StrategySchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['manual', 'automated'], required: true },
  status: { type: String, enum: ['active', 'inactive', 'testing'], default: 'inactive' },
  parameters: { type: Map, of: Schema.Types.Mixed },
  code: { type: String },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isPublic: { type: Boolean, default: false },
  performance: {
    totalTrades: { type: Number, default: 0 },
    winRate: { type: Number, default: 0 },
    profitFactor: { type: Number, default: 0 },
    sharpeRatio: { type: Number, default: 0 },
    maxDrawdown: { type: Number, default: 0 }
  },
  tags: [{ type: String }],
  version: { type: String, default: '1.0.0' },
  lastRun: { type: Date },
  nextRun: { type: Date },
  schedule: {
    type: { type: String, enum: ['interval', 'cron'] },
    value: { type: String }
  },
  exchange: { type: String, required: true },
  symbols: [{ type: String }],
  timeframe: { type: String, required: true },
  riskSettings: {
    maxPositionSize: { type: Number, default: 0 },
    maxLeverage: { type: Number, default: 1 },
    stopLoss: { type: Number },
    takeProfit: { type: Number },
    trailingStop: { type: Boolean, default: false }
  }
});

// Indexes
StrategySchema.index({ user: 1, name: 1 }, { unique: true });
StrategySchema.index({ status: 1, nextRun: 1 });
StrategySchema.index({ isPublic: 1, performance: 1 });

// Update timestamp on save
StrategySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Strategy = mongoose.model<IStrategy>('Strategy', StrategySchema); 