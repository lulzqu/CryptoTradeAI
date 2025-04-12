import mongoose, { Schema, Document } from 'mongoose';

export interface ITrade {
  entryTime: Date;
  exitTime: Date;
  entryPrice: number;
  exitPrice: number;
  size: number;
  type: 'long' | 'short';
  profitLoss: number;
  profitLossPercentage: number;
}

export interface IBacktest extends Document {
  userId: mongoose.Types.ObjectId;
  strategyId: mongoose.Types.ObjectId;
  symbol: string;
  timeframe: string;
  startDate: Date;
  endDate: Date;
  initialBalance: number;
  finalBalance: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  profitFactor: number;
  maxDrawdown: number;
  sharpeRatio: number;
  sortinoRatio: number;
  trades: ITrade[];
  createdAt: Date;
  updatedAt: Date;
}

const TradeSchema = new Schema({
  entryTime: { type: Date, required: true },
  exitTime: { 
    type: Date, 
    required: true,
    validate: {
      validator: function(this: ITrade, value: Date) {
        return value > this.entryTime;
      },
      message: 'Exit time must be after entry time'
    }
  },
  entryPrice: { type: Number, required: true, min: 0 },
  exitPrice: { type: Number, required: true, min: 0 },
  size: { type: Number, required: true, min: 0 },
  type: { 
    type: String, 
    required: true,
    enum: ['long', 'short']
  },
  profitLoss: { type: Number, required: true },
  profitLossPercentage: { type: Number, required: true }
});

const BacktestSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  strategyId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Strategy',
    required: true 
  },
  symbol: { 
    type: String, 
    required: true,
    match: /^[A-Z0-9]+\/[A-Z0-9]+$/ 
  },
  timeframe: { 
    type: String, 
    required: true,
    enum: ['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w', '1M']
  },
  startDate: { type: Date, required: true },
  endDate: { 
    type: Date, 
    required: true,
    validate: {
      validator: function(this: IBacktest, value: Date) {
        return value > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  initialBalance: { type: Number, required: true, min: 0 },
  finalBalance: { type: Number, required: true, min: 0 },
  totalTrades: { type: Number, required: true, min: 0 },
  winningTrades: { type: Number, required: true, min: 0 },
  losingTrades: { type: Number, required: true, min: 0 },
  winRate: { type: Number, required: true, min: 0, max: 1 },
  profitFactor: { type: Number, required: true, min: 0 },
  maxDrawdown: { type: Number, required: true, min: 0, max: 1 },
  sharpeRatio: { type: Number, required: true },
  sortinoRatio: { type: Number, required: true },
  trades: [TradeSchema]
}, {
  timestamps: true
});

// Add indexes for better query performance
BacktestSchema.index({ userId: 1 });
BacktestSchema.index({ strategyId: 1 });
BacktestSchema.index({ symbol: 1 });
BacktestSchema.index({ startDate: 1, endDate: 1 });

export const Backtest = mongoose.model<IBacktest>('Backtest', BacktestSchema); 