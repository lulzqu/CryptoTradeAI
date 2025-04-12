import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.model';
import { IStrategy } from './strategy.model';

export interface ITrade extends Document {
  user: IUser['_id'];
  strategy: IStrategy['_id'];
  symbol: string;
  type: 'buy' | 'sell';
  side: 'long' | 'short';
  status: 'open' | 'closed' | 'cancelled';
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  leverage: number;
  stopLoss?: number;
  takeProfit?: number;
  trailingStop?: number;
  pnl?: number;
  pnlPercentage?: number;
  fees: {
    entry: number;
    exit?: number;
  };
  entryTime: Date;
  exitTime?: Date;
  duration?: number;
  notes?: string;
  tags: string[];
  exchange: string;
  orderId: string;
  positionId?: string;
  metadata: Record<string, any>;
}

const TradeSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  strategy: { type: Schema.Types.ObjectId, ref: 'Strategy' },
  symbol: { type: String, required: true },
  type: { type: String, enum: ['buy', 'sell'], required: true },
  side: { type: String, enum: ['long', 'short'], required: true },
  status: { type: String, enum: ['open', 'closed', 'cancelled'], default: 'open' },
  entryPrice: { type: Number, required: true },
  exitPrice: { type: Number },
  quantity: { type: Number, required: true },
  leverage: { type: Number, default: 1 },
  stopLoss: { type: Number },
  takeProfit: { type: Number },
  trailingStop: { type: Number },
  pnl: { type: Number },
  pnlPercentage: { type: Number },
  fees: {
    entry: { type: Number, required: true },
    exit: { type: Number }
  },
  entryTime: { type: Date, default: Date.now },
  exitTime: { type: Date },
  duration: { type: Number },
  notes: { type: String },
  tags: [{ type: String }],
  exchange: { type: String, required: true },
  orderId: { type: String, required: true },
  positionId: { type: String },
  metadata: { type: Map, of: Schema.Types.Mixed }
});

// Indexes
TradeSchema.index({ user: 1, entryTime: -1 });
TradeSchema.index({ strategy: 1, entryTime: -1 });
TradeSchema.index({ symbol: 1, entryTime: -1 });
TradeSchema.index({ status: 1, entryTime: -1 });
TradeSchema.index({ orderId: 1 }, { unique: true });

// Calculate duration before save
TradeSchema.pre('save', function(next) {
  if (this.exitTime) {
    this.duration = this.exitTime.getTime() - this.entryTime.getTime();
  }
  next();
});

export const Trade = mongoose.model<ITrade>('Trade', TradeSchema); 