import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.model';

export interface IAsset extends Document {
  user: IUser['_id'];
  symbol: string;
  name: string;
  type: 'crypto' | 'stock' | 'forex' | 'commodity';
  exchange: string;
  baseCurrency: string;
  quoteCurrency: string;
  price: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  marketCap?: number;
  circulatingSupply?: number;
  totalSupply?: number;
  maxSupply?: number;
  lastUpdated: Date;
  status: 'active' | 'inactive' | 'delisted';
  precision: {
    price: number;
    quantity: number;
    base: number;
    quote: number;
  };
  limits: {
    minPrice: number;
    maxPrice: number;
    minQuantity: number;
    maxQuantity: number;
    minNotional: number;
    maxNotional: number;
  };
  metadata: Record<string, any>;
}

const AssetSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  symbol: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['crypto', 'stock', 'forex', 'commodity'], required: true },
  exchange: { type: String, required: true },
  baseCurrency: { type: String, required: true },
  quoteCurrency: { type: String, required: true },
  price: { type: Number, required: true },
  priceChange24h: { type: Number, default: 0 },
  priceChangePercentage24h: { type: Number, default: 0 },
  high24h: { type: Number, default: 0 },
  low24h: { type: Number, default: 0 },
  volume24h: { type: Number, default: 0 },
  marketCap: { type: Number },
  circulatingSupply: { type: Number },
  totalSupply: { type: Number },
  maxSupply: { type: Number },
  lastUpdated: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'inactive', 'delisted'], default: 'active' },
  precision: {
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    base: { type: Number, required: true },
    quote: { type: Number, required: true }
  },
  limits: {
    minPrice: { type: Number, required: true },
    maxPrice: { type: Number, required: true },
    minQuantity: { type: Number, required: true },
    maxQuantity: { type: Number, required: true },
    minNotional: { type: Number, required: true },
    maxNotional: { type: Number, required: true }
  },
  metadata: { type: Map, of: Schema.Types.Mixed }
});

// Indexes
AssetSchema.index({ user: 1, symbol: 1, exchange: 1 }, { unique: true });
AssetSchema.index({ type: 1, status: 1 });
AssetSchema.index({ lastUpdated: 1 });

// Update timestamp on save
AssetSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

export const Asset = mongoose.model<IAsset>('Asset', AssetSchema); 