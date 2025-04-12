import { Schema, model, Document } from 'mongoose';
import { PositionType, PositionStatus, MarginMode } from '../types/enums';

export interface IPosition extends Document {
  userId: string;
  symbol: string;
  type: PositionType;
  status: PositionStatus;
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  leverage: number;
  marginMode: MarginMode;
  unrealizedPnl: number;
  realizedPnl: number;
  liquidationPrice: number;
  stopLoss?: number;
  takeProfit?: number;
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
}

const positionSchema = new Schema({
  userId: { type: String, required: true },
  symbol: { type: String, required: true },
  type: { type: String, enum: Object.values(PositionType), required: true },
  status: { type: String, enum: Object.values(PositionStatus), required: true },
  entryPrice: { type: Number, required: true },
  exitPrice: { type: Number, required: false },
  quantity: { type: Number, required: true },
  leverage: { type: Number, required: true },
  marginMode: { type: String, enum: Object.values(MarginMode), required: true },
  unrealizedPnl: { type: Number, default: 0 },
  realizedPnl: { type: Number, default: 0 },
  liquidationPrice: { type: Number, required: true },
  stopLoss: { type: Number, required: false },
  takeProfit: { type: Number, required: false },
  closedAt: { type: Date, required: false }
}, {
  timestamps: true
});

export const PositionModel = model<IPosition>('Position', positionSchema); 