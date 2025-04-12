import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.model';
import { IStrategy } from './strategy.model';
import { ITrade } from './trade.model';

export interface IOrder extends Document {
  user: IUser['_id'];
  strategy: IStrategy['_id'];
  trade: ITrade['_id'];
  symbol: string;
  type: 'market' | 'limit' | 'stop' | 'stop_limit' | 'trailing_stop';
  side: 'buy' | 'sell';
  status: 'open' | 'filled' | 'cancelled' | 'rejected' | 'expired';
  price?: number;
  stopPrice?: number;
  quantity: number;
  filledQuantity: number;
  remainingQuantity: number;
  averagePrice?: number;
  fees: {
    maker: number;
    taker: number;
  };
  createdAt: Date;
  updatedAt: Date;
  filledAt?: Date;
  cancelledAt?: Date;
  exchange: string;
  exchangeOrderId: string;
  clientOrderId: string;
  timeInForce: 'GTC' | 'IOC' | 'FOK';
  reduceOnly: boolean;
  closePosition: boolean;
  metadata: Record<string, any>;
}

const OrderSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  strategy: { type: Schema.Types.ObjectId, ref: 'Strategy' },
  trade: { type: Schema.Types.ObjectId, ref: 'Trade' },
  symbol: { type: String, required: true },
  type: { type: String, enum: ['market', 'limit', 'stop', 'stop_limit', 'trailing_stop'], required: true },
  side: { type: String, enum: ['buy', 'sell'], required: true },
  status: { type: String, enum: ['open', 'filled', 'cancelled', 'rejected', 'expired'], default: 'open' },
  price: { type: Number },
  stopPrice: { type: Number },
  quantity: { type: Number, required: true },
  filledQuantity: { type: Number, default: 0 },
  remainingQuantity: { type: Number, default: 0 },
  averagePrice: { type: Number },
  fees: {
    maker: { type: Number, default: 0 },
    taker: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  filledAt: { type: Date },
  cancelledAt: { type: Date },
  exchange: { type: String, required: true },
  exchangeOrderId: { type: String, required: true },
  clientOrderId: { type: String, required: true },
  timeInForce: { type: String, enum: ['GTC', 'IOC', 'FOK'], default: 'GTC' },
  reduceOnly: { type: Boolean, default: false },
  closePosition: { type: Boolean, default: false },
  metadata: { type: Map, of: Schema.Types.Mixed }
});

// Indexes
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ strategy: 1, createdAt: -1 });
OrderSchema.index({ trade: 1, createdAt: -1 });
OrderSchema.index({ symbol: 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ exchangeOrderId: 1 }, { unique: true });
OrderSchema.index({ clientOrderId: 1 }, { unique: true });

// Update remaining quantity and timestamps
OrderSchema.pre('save', function(next) {
  this.remainingQuantity = this.quantity - this.filledQuantity;
  this.updatedAt = new Date();
  next();
});

export const Order = mongoose.model<IOrder>('Order', OrderSchema); 