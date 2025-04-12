import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.model';

export interface IExchange extends Document {
  user: IUser['_id'];
  name: string;
  type: 'spot' | 'futures' | 'margin';
  apiKey: string;
  apiSecret: string;
  apiPassphrase?: string;
  status: 'active' | 'inactive' | 'error';
  lastSync: Date;
  balance: {
    total: number;
    available: number;
    inOrders: number;
    inPositions: number;
    currencies: Array<{
      currency: string;
      total: number;
      available: number;
      inOrders: number;
      inPositions: number;
    }>;
  };
  settings: {
    autoSync: boolean;
    syncInterval: number;
    maxLeverage: number;
    defaultLeverage: number;
    marginMode: 'isolated' | 'cross';
    positionMode: 'one-way' | 'hedge';
  };
  metadata: Record<string, any>;
}

const ExchangeSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['spot', 'futures', 'margin'], required: true },
  apiKey: { type: String, required: true },
  apiSecret: { type: String, required: true },
  apiPassphrase: { type: String },
  status: { type: String, enum: ['active', 'inactive', 'error'], default: 'inactive' },
  lastSync: { type: Date },
  balance: {
    total: { type: Number, default: 0 },
    available: { type: Number, default: 0 },
    inOrders: { type: Number, default: 0 },
    inPositions: { type: Number, default: 0 },
    currencies: [{
      currency: { type: String, required: true },
      total: { type: Number, default: 0 },
      available: { type: Number, default: 0 },
      inOrders: { type: Number, default: 0 },
      inPositions: { type: Number, default: 0 }
    }]
  },
  settings: {
    autoSync: { type: Boolean, default: true },
    syncInterval: { type: Number, default: 60 },
    maxLeverage: { type: Number, default: 1 },
    defaultLeverage: { type: Number, default: 1 },
    marginMode: { type: String, enum: ['isolated', 'cross'], default: 'isolated' },
    positionMode: { type: String, enum: ['one-way', 'hedge'], default: 'one-way' }
  },
  metadata: { type: Map, of: Schema.Types.Mixed }
});

// Indexes
ExchangeSchema.index({ user: 1, name: 1 }, { unique: true });
ExchangeSchema.index({ status: 1, lastSync: 1 });

// Encrypt sensitive data before save
ExchangeSchema.pre('save', function(next) {
  // TODO: Implement encryption for apiKey, apiSecret, and apiPassphrase
  next();
});

export const Exchange = mongoose.model<IExchange>('Exchange', ExchangeSchema); 