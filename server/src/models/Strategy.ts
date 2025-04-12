import mongoose, { Schema, Document } from 'mongoose';
import { createNotification } from '../controllers/notification.controller';
import { NotificationType, NotificationPriority } from './Notification';
import { SignalType, SignalSource, TimeFrame } from './Signal';
import { TradingStrategy } from '../config/autoTrading.config';

// Enum cho loại chiến lược
export enum StrategyType {
  TREND_FOLLOWING = 'trend_following',
  MEAN_REVERSION = 'mean_reversion',
  BREAKOUT = 'breakout',
  SCALPING = 'scalping',
  SWING_TRADING = 'swing_trading',
  ARBITRAGE = 'arbitrage',
  AI_DRIVEN = 'ai_driven'
}

// Enum cho trạng thái chiến lược
export enum StrategyStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  ARCHIVED = 'archived',
  TESTING = 'testing'
}

// Interface cho Strategy
export interface IStrategy extends Document {
  name: string;
  description?: string;
  type: TradingStrategy;
  user: mongoose.Types.ObjectId;
  status: StrategyStatus;
  parameters: Record<string, any>;
  performanceMetrics: {
    totalTrades: number;
    winRate: number;
    profitFactor: number;
    maxDrawdown: number;
    averageReturn: number;
  };
  backtestResults?: Array<{
    date: Date;
    result: Record<string, any>;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// Schema cho Strategy
const StrategySchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: Object.values(TradingStrategy),
    required: true
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: Object.values(StrategyStatus),
    default: StrategyStatus.ACTIVE
  },
  parameters: {
    type: Schema.Types.Mixed,
    default: {}
  },
  performanceMetrics: {
    totalTrades: {
      type: Number,
      default: 0
    },
    winRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    profitFactor: {
      type: Number,
      default: 0
    },
    maxDrawdown: {
      type: Number,
      default: 0
    },
    averageReturn: {
      type: Number,
      default: 0
    }
  },
  backtestResults: [{
    date: {
      type: Date,
      default: Date.now
    },
    result: {
      type: Schema.Types.Mixed,
      default: {}
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes để tối ưu truy vấn
StrategySchema.index({ user: 1, type: 1, status: 1 });
StrategySchema.index({ 'performanceMetrics.winRate': -1 });

// Virtual để kiểm tra hiệu quả của chiến lược
StrategySchema.virtual('isSuccessful').get(function(this: IStrategy) {
  return this.performanceMetrics.winRate >= 60 && 
         this.performanceMetrics.profitFactor > 1;
});

// Phương thức để tạo chiến lược mới
StrategySchema.statics.createStrategy = async function(
  data: Partial<IStrategy>
): Promise<IStrategy> {
  return this.create(data);
};

// Phương thức để cập nhật hiệu suất
StrategySchema.methods.updatePerformance = function(
  this: IStrategy, 
  metrics: Partial<IStrategy['performanceMetrics']>
): Promise<IStrategy> {
  this.performanceMetrics = {
    ...this.performanceMetrics,
    ...metrics
  };
  return this.save();
};

// Phương thức để lấy các chiến lược hiệu quả
StrategySchema.statics.getSuccessfulStrategies = function(
  userId?: string
) {
  const query = userId 
    ? { 
        user: userId, 
        'performanceMetrics.winRate': { $gte: 60 },
        'performanceMetrics.profitFactor': { $gt: 1 }
      }
    : { 
        'performanceMetrics.winRate': { $gte: 60 },
        'performanceMetrics.profitFactor': { $gt: 1 }
      };

  return this.find(query).sort({ 'performanceMetrics.winRate': -1 });
};

// Tạo model
const Strategy = mongoose.model<IStrategy>('Strategy', StrategySchema);

export default Strategy; 