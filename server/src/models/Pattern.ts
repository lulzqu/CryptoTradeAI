import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IPattern extends Document {
  symbol: string;
  timeframe: string;
  name: string;
  type: 'bullish' | 'bearish';
  confidence: number;
  startPrice: number;
  endPrice: number;
  createdAt: Date;
}

const PatternSchema: Schema = new Schema({
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
    required: [true, 'Vui lòng cung cấp tên mẫu hình'],
    enum: [
      'Head and Shoulders', 
      'Double Top/Bottom', 
      'Triangle', 
      'Flag', 
      'Pennant', 
      'Cup and Handle', 
      'Wedge'
    ]
  },
  type: {
    type: String,
    enum: ['bullish', 'bearish'],
    required: [true, 'Vui lòng xác định loại mẫu hình']
  },
  confidence: {
    type: Number,
    min: [0, 'Độ tin cậy phải từ 0 đến 100'],
    max: [100, 'Độ tin cậy phải từ 0 đến 100'],
    default: 50
  },
  startPrice: {
    type: Number,
    required: [true, 'Vui lòng cung cấp giá bắt đầu']
  },
  endPrice: {
    type: Number,
    required: [true, 'Vui lòng cung cấp giá kết thúc']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Pattern: Model<IPattern> = mongoose.model<IPattern>('Pattern', PatternSchema);

export default Pattern; 