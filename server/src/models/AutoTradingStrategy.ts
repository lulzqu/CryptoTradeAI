import mongoose, { Document, Schema, Model } from 'mongoose';
import { IUser } from './User';

export interface IAutoTradingStrategy extends Document {
  user: IUser['_id'];
  name: string;
  symbol: string;
  timeframe: string;
  indicators: {
    name: string;
    parameters: Record<string, any>;
  }[];
  entryConditions: {
    type: string;
    value: any;
  }[];
  exitConditions: {
    type: string;
    value: any;
  }[];
  riskManagement: {
    stopLoss: number;
    takeProfit: number;
    maxPositionSize: number;
    maxDailyLoss: number;
  };
  status: 'active' | 'inactive' | 'paused';
  lastExecuted: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AutoTradingStrategySchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên chiến lược']
    },
    symbol: {
      type: String,
      required: [true, 'Vui lòng chọn cặp giao dịch']
    },
    timeframe: {
      type: String,
      required: [true, 'Vui lòng chọn khung thời gian']
    },
    indicators: [{
      name: String,
      parameters: Schema.Types.Mixed
    }],
    entryConditions: [{
      type: String,
      value: Schema.Types.Mixed
    }],
    exitConditions: [{
      type: String,
      value: Schema.Types.Mixed
    }],
    riskManagement: {
      stopLoss: {
        type: Number,
        required: true
      },
      takeProfit: {
        type: Number,
        required: true
      },
      maxPositionSize: {
        type: Number,
        required: true
      },
      maxDailyLoss: {
        type: Number,
        required: true
      }
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'paused'],
      default: 'inactive'
    },
    lastExecuted: Date
  },
  {
    timestamps: true
  }
);

const AutoTradingStrategy: Model<IAutoTradingStrategy> = mongoose.model<IAutoTradingStrategy>(
  'AutoTradingStrategy',
  AutoTradingStrategySchema
);

export default AutoTradingStrategy; 