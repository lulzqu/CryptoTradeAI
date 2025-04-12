import mongoose, { Schema, Document } from 'mongoose';
import { createNotification } from '../controllers/notification.controller';
import { NotificationType, NotificationPriority } from './Notification';
import { SignalType, TimeFrame } from './Signal';
import { StrategyType } from './Strategy';
import { TradingStrategy } from '../config/autoTrading.config';

// Enum cho trạng thái backtest
export enum BacktestStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

// Enum cho loại backtest
export enum BacktestType {
  HISTORICAL = 'historical',
  MONTE_CARLO = 'monte_carlo',
  WALK_FORWARD = 'walk_forward',
  SENSITIVITY = 'sensitivity'
}

// Interface cho Backtest
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
  trades: Array<{
    entryTime: Date;
    exitTime: Date;
    entryPrice: number;
    exitPrice: number;
    size: number;
    type: 'long' | 'short';
    profitLoss: number;
    profitLossPercentage: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// Schema cho Backtest
const BacktestSchema: Schema = new Schema({
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
    required: true
  },
  timeframe: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  initialBalance: {
    type: Number,
    required: true
  },
  finalBalance: {
    type: Number,
    required: true
  },
  totalTrades: {
    type: Number,
    default: 0
  },
  winningTrades: {
    type: Number,
    default: 0
  },
  losingTrades: {
    type: Number,
    default: 0
  },
  winRate: {
    type: Number,
    default: 0
  },
  profitFactor: {
    type: Number,
    default: 0
  },
  maxDrawdown: {
    type: Number,
    default: 0
  },
  sharpeRatio: {
    type: Number,
    default: 0
  },
  sortinoRatio: {
    type: Number,
    default: 0
  },
  trades: [{
    entryTime: Date,
    exitTime: Date,
    entryPrice: Number,
    exitPrice: Number,
    size: Number,
    type: {
      type: String,
      enum: ['long', 'short']
    },
    profitLoss: Number,
    profitLossPercentage: Number
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes để tối ưu truy vấn
BacktestSchema.index({ userId: 1, strategyId: 1, status: 1 });
BacktestSchema.index({ startDate: -1, endDate: -1 });

// Virtual để kiểm tra hiệu quả của backtest
BacktestSchema.virtual('isSuccessful').get(function(this: IBacktest) {
  return this.results.winRate >= 60 && 
         this.results.profitFactor > 1;
});

// Phương thức để tạo backtest mới
BacktestSchema.statics.createBacktest = async function(
  data: Partial<IBacktest>
): Promise<IBacktest> {
  return this.create(data);
};

// Phương thức để cập nhật kết quả backtest
BacktestSchema.methods.updateResults = function(
  this: IBacktest, 
  results: Partial<IBacktest['results']>
): Promise<IBacktest> {
  this.results = {
    ...this.results,
    ...results
  };
  this.status = BacktestStatus.COMPLETED;
  return this.save();
};

// Phương thức để lấy các backtest thành công
BacktestSchema.statics.getSuccessfulBacktests = function(
  userId?: string
) {
  const query = userId 
    ? { 
        userId: userId, 
        'results.winRate': { $gte: 60 },
        'results.profitFactor': { $gt: 1 }
      }
    : { 
        'results.winRate': { $gte: 60 },
        'results.profitFactor': { $gt: 1 }
      };

  return this.find(query)
    .sort({ 'results.winRate': -1 })
    .populate('strategyId');
};

// Tạo model
const Backtest = mongoose.model<IBacktest>('Backtest', BacktestSchema);

export default Backtest; 