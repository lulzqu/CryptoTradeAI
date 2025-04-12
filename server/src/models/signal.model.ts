import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.model';
import { IStrategy } from './strategy.model';

export interface ISignal extends Document {
  user: IUser['_id'];
  strategy: IStrategy['_id'];
  symbol: string;
  type: 'buy' | 'sell' | 'alert';
  status: 'active' | 'triggered' | 'cancelled' | 'expired';
  price: number;
  targetPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  timeframe: string;
  strength: 'weak' | 'medium' | 'strong';
  confidence: number;
  indicators: Array<{
    name: string;
    value: number;
    signal: 'buy' | 'sell' | 'neutral';
    weight: number;
  }>;
  metadata: {
    volume?: number;
    rsi?: number;
    macd?: {
      value: number;
      signal: number;
      histogram: number;
    };
    bollingerBands?: {
      upper: number;
      middle: number;
      lower: number;
    };
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
  triggeredAt?: Date;
  expiredAt?: Date;
  notes?: string;
  tags: string[];
}

const SignalSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  strategy: { type: Schema.Types.ObjectId, ref: 'Strategy' },
  symbol: { type: String, required: true },
  type: { type: String, enum: ['buy', 'sell', 'alert'], required: true },
  status: { type: String, enum: ['active', 'triggered', 'cancelled', 'expired'], default: 'active' },
  price: { type: Number, required: true },
  targetPrice: { type: Number },
  stopLoss: { type: Number },
  takeProfit: { type: Number },
  timeframe: { type: String, required: true },
  strength: { type: String, enum: ['weak', 'medium', 'strong'], required: true },
  confidence: { type: Number, required: true, min: 0, max: 1 },
  indicators: [{
    name: { type: String, required: true },
    value: { type: Number, required: true },
    signal: { type: String, enum: ['buy', 'sell', 'neutral'], required: true },
    weight: { type: Number, required: true, min: 0, max: 1 }
  }],
  metadata: { type: Map, of: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  triggeredAt: { type: Date },
  expiredAt: { type: Date },
  notes: { type: String },
  tags: [{ type: String }]
});

// Indexes
SignalSchema.index({ user: 1, createdAt: -1 });
SignalSchema.index({ strategy: 1, status: 1 });
SignalSchema.index({ symbol: 1, status: 1 });
SignalSchema.index({ type: 1, status: 1 });

// Update timestamp on save
SignalSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Signal = mongoose.model<ISignal>('Signal', SignalSchema); 