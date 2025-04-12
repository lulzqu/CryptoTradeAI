import mongoose, { Schema, Document } from 'mongoose';
import { TradingStrategy } from '../config/autoTrading.config';

// Enum cho loại tín hiệu
export enum SignalType {
  BUY = 'buy',
  SELL = 'sell',
  HOLD = 'hold'
}

// Enum cho nguồn tín hiệu
export enum SignalSource {
  AI = 'ai',
  TECHNICAL_ANALYSIS = 'technical_analysis',
  FUNDAMENTAL_ANALYSIS = 'fundamental_analysis',
  MANUAL = 'manual'
}

// Enum cho trạng thái tín hiệu
export enum SignalStatus {
  ACTIVE = 'active',
  TRIGGERED = 'triggered',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled'
}

// Enum cho khung thời gian
export enum TimeFrame {
  M1 = '1m',
  M5 = '5m',
  M15 = '15m',
  M30 = '30m',
  H1 = '1h',
  H4 = '4h',
  D1 = '1d'
}

// Interface cho Signal
export interface ISignal extends Document {
  symbol: string;
  type: SignalType;
  strategy: TradingStrategy;
  source: SignalSource;
  confidence: number;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  leverage: number;
  indicators: Record<string, any>;
  analysis: string;
  user?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  shares: Array<{
    user: mongoose.Types.ObjectId;
    type: string;
    recipients: mongoose.Types.ObjectId[];
    message?: string;
    tags?: string[];
  }>;
}

// Skema cho Signal
const SignalSchema: Schema = new Schema({
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  type: {
    type: String,
    enum: Object.values(SignalType),
    required: true
  },
  strategy: {
    type: String,
    enum: Object.values(TradingStrategy),
    required: true
  },
  source: {
    type: String,
    enum: Object.values(SignalSource),
    default: SignalSource.AI
  },
  confidence: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  entryPrice: {
    type: Number,
    required: true,
    min: 0
  },
  stopLoss: {
    type: Number,
    required: true,
    min: 0
  },
  takeProfit: {
    type: Number,
    required: true,
    min: 0
  },
  leverage: {
    type: Number,
    default: 1,
    min: 1,
    max: 100
  },
  indicators: {
    type: Schema.Types.Mixed,
    default: {}
  },
  analysis: {
    type: String,
    trim: true
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  shares: [{
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    },
    type: {
      type: String,
      enum: ['public', 'private', 'followers']
    },
    recipients: [{
      type: mongoose.Types.ObjectId,
      ref: 'User'
    }],
    message: String,
    tags: [String]
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes để tối ưu truy vấn
SignalSchema.index({ symbol: 1, createdAt: -1 });
SignalSchema.index({ user: 1, createdAt: -1 });
SignalSchema.index({ confidence: -1 });

// Virtual để kiểm tra độ tin cậy của tín hiệu
SignalSchema.virtual('isReliable').get(function(this: ISignal) {
  return this.confidence >= 70;
});

// Phương thức để tạo tín hiệu mới
SignalSchema.statics.createSignal = async function(
  data: Partial<ISignal>
): Promise<ISignal> {
  return this.create(data);
};

// Phương thức để lấy các tín hiệu gần đây
SignalSchema.statics.getRecentSignals = function(
  days: number = 7, 
  minConfidence: number = 50
) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - days);

  return this.find({
    createdAt: { $gte: sevenDaysAgo },
    confidence: { $gte: minConfidence }
  }).sort({ createdAt: -1 });
};

// Tạo model
const Signal = mongoose.model<ISignal>('Signal', SignalSchema);

export default Signal; 