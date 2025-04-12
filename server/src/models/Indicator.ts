import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IIndicator extends Document {
  symbol: string;
  timeframe: string;
  name: string;
  value: number;
  signal: 'buy' | 'sell' | 'neutral';
  createdAt: Date;
}

const IndicatorSchema: Schema = new Schema({
  symbol: {
    type: String,
    required: [true, 'Vui lòng cung cấp mã giao dịch']
  },
  timeframe: {
    type: String,
    required: [true, 'Vui lòng cung cấp khung thời gian'],
    enum: ['1m', '5m', '15m', '30m', '1h', '4h', '1d']
  },
  name: {
    type: String,
    required: [true, 'Vui lòng cung cấp tên chỉ báo'],
    enum: [
      'RSI', 
      'MACD', 
      'Stochastic', 
      'Bollinger Bands', 
      'Moving Average', 
      'EMA', 
      'ADX'
    ]
  },
  value: {
    type: Number,
    required: [true, 'Vui lòng cung cấp giá trị chỉ báo']
  },
  signal: {
    type: String,
    enum: ['buy', 'sell', 'neutral'],
    default: 'neutral'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Indicator: Model<IIndicator> = mongoose.model<IIndicator>('Indicator', IndicatorSchema);

export default Indicator; 